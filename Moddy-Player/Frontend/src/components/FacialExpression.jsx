import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import "./facialExpression.css"
import axios from 'axios';

export default function FacialExpression({setSongs}) {
    const videoRef = useRef();

    // --- Cleanup function Ref ---
    // Added a ref to hold the video stream for cleanup
    const streamRef = useRef(null);

    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream; // Store the stream for cleanup
                }
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood() {
        if (!videoRef.current) {
            console.error("Video element not available");
            return;
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

            // --- Use Environment Variable for API URL ---
            const apiUrl = import.meta.env.VITE_API_URL;
            console.log(`Fetching songs for mood: ${_expression} from ${apiUrl}`); // Log the URL being used

            axios.get(`${apiUrl}/songs?mood=${_expression}`)
                .then(response => {
                    console.log("API Response:", response.data);
                    setSongs(response.data.songs || []); // Ensure setSongs receives an array
                })
                .catch(error => {
                    console.error("Error fetching songs:", error);
                    // Handle specific errors if needed (e.g., CORS, 404)
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.error("Error data:", error.response.data);
                        console.error("Error status:", error.response.status);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.error("Error request:", error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.error('Error message:', error.message);
                    }
                    setSongs([]); // Clear songs on error
                });

        } catch (error) {
            console.error("Error during face detection:", error);
            setSongs([]); // Clear songs on detection error
        }
    }

    useEffect(() => {
        loadModels().then(startVideo);

        // --- Cleanup Function ---
        // Stops the webcam when the component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                console.log("Webcam stream stopped");
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

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
