import "./Webcam.css";
import * as ReactWebcam from "react-webcam";
import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import sound from "../sound/ping.mp3";
let currentHandsUp = false;
let prevHandsUp = false;
let camera = null;
const URL = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/";

const ping = new Audio(sound);

function Webcam() {
  const [message, setMessage] = useState("Just put your hands up!");
  const webcamRef = useRef(null);

  useEffect(() => {
    //Plays sound and prints message when hands are raised
    const wellDone = () => {
      setMessage("Good job!");
      ping.play();
    };
    /// Checks if hands are up
    const checkIfHandsAreUp = (landMarks) => {
      return (
        landMarks[9].y > landMarks[13].y &&
        landMarks[10].y > landMarks[14].y &&
        landMarks[14].y > landMarks[16].y &&
        landMarks[13].y > landMarks[15].y
      );
    };

    // Checks if hand state changed - if they were lowered or raised back up
    const didHandStateChange = () => {
      if (currentHandsUp !== prevHandsUp) return true;
      return false;
    };
    // Applies correct events, when hands are raised or lowered
    const setCorrectEvents = () => {
      if (prevHandsUp) {
        wellDone();
      } else {
        setMessage("Just put your hands up!");
      }
    };

    function onResults(results) {
      if (!results.poseLandmarks) return;

      currentHandsUp = checkIfHandsAreUp(results.poseLandmarks);

      if (didHandStateChange()) {
        prevHandsUp = !prevHandsUp;
        setCorrectEvents(); // if hands are up plays sound and prints message, if hands are down prints message
      }
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `${URL}${file}`;
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
