import "./Page.css";
import React, { useState } from "react";
import Webcam from "./Webcam";

function Page() {
  const [isClicked, setClicked] = useState(false);

  const clickHandler = () => {
    setClicked(true);
  };

  return (
    <div className="container">
      {!isClicked && (
        <button className="button" onClick={clickHandler}>
          Click to start
        </button>
      )}
      {isClicked && <Webcam />}
    </div>
  );
}

export default Page;
