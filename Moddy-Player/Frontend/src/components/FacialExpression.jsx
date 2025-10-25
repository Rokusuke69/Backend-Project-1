import React, { useEffect, useRef } from "react"; // 1. Removed useState
import * as faceapi from "face-api.js";

export default function FacialExpression() {
  const videoRef = useRef();
  // No state needed
  // const [detectedExpression, setDetectedExpression] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    loadModels().then(startVideo);

    const videoElement = videoRef.current;

    // --- Cleanup Function ---
    return () => {
      if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleDetectClick = async () => {
    // 2. No "Detecting..." text needed
    // setDetectedExpression("Detecting..."); 

    if (videoRef.current) {
      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        const expressions = detections[0].expressions;
        let mostProbableExpression = 0;
        let _expression = "";

        for (const expression of Object.keys(expressions)) {
          if (expressions[expression] > mostProbableExpression) {
            mostProbableExpression = expressions[expression];
            _expression = expression;
          }
        }
        
        // 3. Print result to the console
        console.log("Detected Expression:", _expression); 
        
      } else {
        
        // 4. Print "No face" message to the console
        console.log("No face detected");
      }
    }
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "720px", height: "560px" }}
        />
      </div>

      <button onClick={handleDetectClick} style={{ marginTop: "10px" }}>
        Detect My Mood
      </button>
      
      {/* 5. Removed the h2 element that showed the state */}
    </div>
  );
}