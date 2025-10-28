// components/FacialExpression.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./facialExpression.css"
import axios from 'axios';

// Note: This version expects setDetectedMood and setIsLoading props from App.jsx
export default function FacialExpression({setSongs, setDetectedMood, setIsLoading}) {
    const videoRef = useRef();
    const [isDetecting, setIsDetecting] = useState(false);
    const [hasCameraAccess, setHasCameraAccess] = useState(false);
    // Ref added to manage the stream for cleanup
    const streamRef = useRef(null);

    const loadModels = async () => {
        const MODEL_URL = '/models';
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            console.log("Face API models loaded successfully");
        } catch (error) {
            console.error("Error loading models:", error);
        }
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream; // Store stream for cleanup
                    setHasCameraAccess(true);
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
                setHasCameraAccess(false);
            });
    };

    async function detectMood() {
        if (!hasCameraAccess) {
             // Reverted alert to console.log as alerts are discouraged
            console.warn("Camera access not granted. Please allow camera access.");
            // You could show a more user-friendly message in the UI instead
            return;
        }

        setIsDetecting(true);
        setIsLoading(true); // Prop from parent
        setDetectedMood('Detecting...'); // Prop from parent

        try {
            if (!videoRef.current) {
                console.error("Video ref not available");
                throw new Error("Video element not ready.");
            }
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            let mostProbableExpression = 0;
            let _expression = '';

            if (!detections || detections.length === 0) {
                console.log("No face detected");
                setDetectedMood("No face detected"); // Prop from parent
                setIsLoading(false); // Prop from parent
                setIsDetecting(false);
                setSongs([]); // Clear songs
                return;
            }

            const expressions = detections[0].expressions;

            for (const expression of Object.keys(expressions)) {
                if (expressions[expression] > mostProbableExpression) {
                    mostProbableExpression = expressions[expression];
                    _expression = expression;
                }
            }

            setDetectedMood(_expression); // Prop from parent

            // --- USE ENVIRONMENT VARIABLE ---
            const apiUrl = import.meta.env.VITE_API_URL;
            console.log(`Fetching songs for mood: ${_expression} from ${apiUrl}`); // Log the actual URL being used

            axios.get(`${apiUrl}/songs?mood=${_expression}`)
                .then(response => {
                    console.log("API Response:", response.data);
                    setSongs(response.data.songs || []);
                })
                .catch(error => {
                    console.error("Error fetching songs:", error);
                    setDetectedMood("API Error"); // Prop from parent
                    setSongs([]);
                })
                .finally(() => { // Ensure loading/detecting state is reset
                    setIsLoading(false); // Prop from parent
                    setIsDetecting(false);
                });

        } catch (error) {
            console.error("Error detecting mood:", error);
            setDetectedMood("Detection Error"); // Prop from parent
            setIsLoading(false); // Prop from parent
            setIsDetecting(false);
            setSongs([]);
        }
    }

    useEffect(() => {
        loadModels().then(startVideo);

        // Cleanup function to stop video stream on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                console.log("Webcam stream stopped on component unmount.");
            }
        };
    }, []); // Empty dependency array

    return (
        <div className='mood-element'>
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className='user-video-feed'
                />
                {/* Optional Overlay - uncomment if needed
                <div className="video-overlay">
                    <div className="video-label">Live Camera Feed</div>
                    <div className="video-instruction">Position your face in the frame</div>
                </div>
                */}
            </div>

            <div className="controls">
                <button
                    onClick={detectMood}
                    disabled={isDetecting || !hasCameraAccess} // Disable if detecting or no camera access
                >
                    {isDetecting ? 'Detecting...' : 'Detect Mood'}
                </button>

                {!hasCameraAccess && (
                    <div className="permission-note" style={{ color: 'orange', marginTop: '10px' }}>
                        Camera access is required. Please allow permissions.
                    </div>
                )}
            </div>
        </div>
    );
}

