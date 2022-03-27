import "./Webcam.css";
import * as ReactWebcam from "react-webcam";
import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import sound from "../sound/ping.mp3";
let currentHandsUp = false;
let prevHandsUp = false;
let camera = null;

const ping = new Audio(sound);

function Webcam() {
  const [message, setMessage] = useState("Just put your hands up!");
  const webcamRef = useRef(null);

  useEffect(() => {
    const wellDone = () => {
      setMessage("Good job!");

      ping.play();
    };
    function onResults(results) {
      if (!results.poseLandmarks) return;

      if (
        results.poseLandmarks[9].y > results.poseLandmarks[13].y &&
        results.poseLandmarks[10].y > results.poseLandmarks[14].y &&
        results.poseLandmarks[14].y > results.poseLandmarks[16].y &&
        results.poseLandmarks[13].y > results.poseLandmarks[15].y
      ) {
        currentHandsUp = true;
      } else {
        currentHandsUp = false;
      }

      if (currentHandsUp !== prevHandsUp) {
        prevHandsUp = !prevHandsUp;

        if (prevHandsUp) wellDone();
        if (!prevHandsUp) setMessage("Just put your hands up!");
      }
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults(onResults);

    if (webcamRef.current) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <p className="message">{message}</p>
      <ReactWebcam ref={webcamRef} className="input_video" />
    </div>
  );
}

export default Webcam;
