import React from "react";
import hero from "../../images/hero-img.jpg";
const Hero = () => {
  return (
    <div>
      <div
        className="hero-container"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      >
        <div className="text">
          <div className="innerText">
            <h4 className="title-hero">Dream rental</h4>
            <h1 className="sub-title-hero">We will meet yours</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
