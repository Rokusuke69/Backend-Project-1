// components/FacialExpression.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./facialExpression.css"
import axios from 'axios';

export default function FacialExpression({setSongs, setDetectedMood, setIsLoading}) {
    const videoRef = useRef();
    const [isDetecting, setIsDetecting] = useState(false);
    const [hasCameraAccess, setHasCameraAccess] = useState(false);
    
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
                videoRef.current.srcObject = stream;
                setHasCameraAccess(true);
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
                setHasCameraAccess(false);
            });
    };
    
    async function detectMood() {
        if (!hasCameraAccess) {
            alert("Please allow camera access to detect your mood");
            return;
        }
        
        setIsDetecting(true);
        setIsLoading(true);
        
        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();
                
            let mostProbableExpression = 0;
            let _expression = '';
            
            if (!detections || detections.length === 0) {
                console.log("No face detected");
                setDetectedMood("No face detected");
                setIsLoading(false);
                setIsDetecting(false);
                return;
            }
            
            for (const expression of Object.keys(detections[0].expressions)) {
                if (detections[0].expressions[expression] > mostProbableExpression) {
                    mostProbableExpression = detections[0].expressions[expression];
                    _expression = expression;
                }
            }
            
            setDetectedMood(_expression);
            
            // Get songs based on detected mood
            axios.get(`http://localhost:3000/songs?mood=${_expression}`)
                .then(response => {
                    console.log(response.data);
                    setSongs(response.data.songs);
                    setIsLoading(false);
                    setIsDetecting(false);
                })
                .catch(error => {
                    console.error("Error fetching songs:", error);
                    setIsLoading(false);
                    setIsDetecting(false);
                });
                
        } catch (error) {
            console.error("Error detecting mood:", error);
            setIsLoading(false);
            setIsDetecting(false);
        }
    }
    
    useEffect(() => {
        loadModels().then(startVideo);
    }, []);
    
    return (
        <div className='mood-element'>
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className='user-video-feed'
                />
                <div className="video-overlay">
                    <div className="video-label">Live Camera Feed</div>
                    <div className="video-instruction">Position your face in the frame</div>
                </div>
            </div>
            
            <div className="controls">
                <button 
                    onClick={detectMood} 
                    disabled={isDetecting}
                >
                    {isDetecting ? 'Detecting...' : 'Detect Mood'}
                </button>
                
                {!hasCameraAccess && (
                    <div className="permission-note">
                        Camera access is required for mood detection. Please allow camera permissions.
                    </div>
                )}
            </div>
        </div>
    );
}