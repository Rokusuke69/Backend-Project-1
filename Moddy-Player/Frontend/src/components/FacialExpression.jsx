import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import "./facialExpression.css"
import axios from 'axios';

export default function FacialExpression({setSongs}) {
    const videoRef = useRef();

    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                // Check if videoRef.current is available before assigning
                if(videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood() {
        if (!videoRef.current) {
             console.error("Video ref not available for detection.");
             return; // Exit if video element isn't ready
        }
        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            let mostProbableExpression = 0; // Fixed typo
            let _expression = '';

            if (!detections || detections.length === 0) {
                console.log("No face detected");
                setSongs([]); // Clear songs if no face detected
                return;
            }

            const expressions = detections[0].expressions;

            for (const expression of Object.keys(expressions)) {
                if (expressions[expression] > mostProbableExpression) {
                    mostProbableExpression = expressions[expression];
                    _expression = expression;
                }
            }

            // --- USE ENVIRONMENT VARIABLE ---
            const apiUrl = import.meta.env.VITE_API_URL;
            console.log(`Fetching songs for mood: ${_expression} from ${apiUrl}`); // Log for debugging

            // Make the API call using the environment variable
            axios.get(`${apiUrl}/songs?mood=${_expression}`)
                .then(response => {
                    console.log("API Response:", response.data);
                    // Ensure setSongs always receives an array, even if response.data.songs is undefined
                    setSongs(response.data.songs || []); 
                })
                .catch(error => {
                    // Basic error logging
                    console.error("Error fetching songs:", error);
                    setSongs([]); // Clear songs on error
                });
        } catch (error) {
             console.error("Error during face detection:", error);
             setSongs([]); // Clear songs on detection error
        }
    }

    useEffect(() => {
        loadModels().then(startVideo);
        // No cleanup function added, as requested
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className='mood-element'>
            <video
                ref={videoRef}
                autoPlay
                muted
                className='user-video-feed'
            />
            <button onClick={detectMood}>Detect Mood</button>
        </div>
    );
}

