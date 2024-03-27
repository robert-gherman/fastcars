import React, { useEffect } from "react";
import myImage1 from "../../images/image24.png";
import myImage2 from "../../images/image25.png";
import myImage3 from "../../images/image26.png";
import { AiOutlineCheck } from "react-icons/ai";
import Footer from "../../Scenes/Footer";
import Martin from "../../images/martin.png";
import Noam from "../../images/noam.png";
import Hikaru from "../../images/hikaru.png";
const About = () => {
  return (
    <div>
      <div className="about-us-container">
        <h1 className="about-us-title">About Us</h1>
        <div className="about-us-description">
          <p>
            FastCars sports and luxury car rental focuses on one goal, which is
            your complete satisfaction with renting a sports car with us. We
            will guarantee you maximum joy and comfort of using sports cars in
            our rental. We also try to make this pleasure not too expensive.
          </p>
          <p>
            We rent our sports cars in Romania, and most often in the following
            cities: Timisoara, Cluj-Napoca, Bucuresti without a deposit and at a
            good price. We rent our sports and luxury cars daily or for a longer
            period, i.e. long-term. When choosing a rental in the cities of
            Timisoara, Cluj-Napoca, Bucuresti,Arad you can expect professional
            service from us.
          </p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4385.111125674535!2d21.323320735297518!3d46.181665487111744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47459852d467bc79%3A0xb2f9b185f99c90af!2sBig%20Chicken!5e0!3m2!1sen!2sro!4v1673120440435!5m2!1sen!2sro"
          width="75%"
          height="450"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <p className="about-us-description">
          Sports cars are a category of cars with more emphasis on driving
          dynamics than practicality. At the same time, these are civilian cars
          that must comply with all technical rules governing traffic on public
          roads.They can be:
        </p>
        <p className="about-us-description" style={{ fontWeight: "bold" }}>
          Cars modified from classic bodies to sports bodies (e.g. as a result
          of tuning)
        </p>
        <img
          src={myImage1}
          alt="A description of the image"
          style={{ width: "75%" }}
        />
        <p className="about-us-description" style={{ fontWeight: "bold" }}>
          Typically sports cars produced for fun driving
        </p>
        <img
          src={myImage2}
          alt="A description of the image"
          style={{ width: "75%" }}
        />
        <p className="about-us-description" style={{ fontWeight: "bold" }}>
          Extreme cars, designed for competitive and racing driving
        </p>
        <img
          src={myImage3}
          alt="A description of the image"
          style={{ width: "75%" }}
        />

        <p className="about-us-description">
          So before you choose sports cars to rent or buy, find out which one is
          worth choosing. We, on the other hand, will provide appropriate
          preparation and professional service:
        </p>
        <div className="checklist">
          <div className="left-side">
            <ul className="ul-about">
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>Attractive rental prices</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>Possible delivery of cars in Arad</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>Rental satisfaction guaranteed</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>Short-term and long-term rental</span>
              </li>
            </ul>
          </div>
          <div className="right-side">
            <ul className="ul-about">
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>Most cars without a deposit</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>The best rental company in Timisoara</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>We have beautiful and fast sports cars</span>
              </li>
              <li>
                <AiOutlineCheck color="F7A139" />
                <span>We rent our cars for the wedding</span>
              </li>
            </ul>
          </div>
        </div>
        <button class="call-us-button" style={{ fontWeight: "bold" }}>
          Contact Us
        </button>
        <h2 className="team-title">Meet Our Team</h2>
        <div className="about-us-team">
          <div className="team-member">
            <img src={Noam} alt="Team Member 1" className="team-member-image" />
            <h3 className="team-member-name">Jane Doe</h3>
            <p className="team-member-position">CEO</p>
          </div>
          <div className="team-member">
            <img
              src={Martin}
              alt="Team Member 2"
              className="team-member-image"
            />
            <h3 className="team-member-name">John Doe</h3>
            <p className="team-member-position">CFO</p>
          </div>
          <div className="team-member">
            <img
              src={Hikaru}
              alt="Team Member 3"
              className="team-member-image"
            />
            <h3 className="team-member-name">Jessica Smith</h3>
            <p className="team-member-position">CTO</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default About;
