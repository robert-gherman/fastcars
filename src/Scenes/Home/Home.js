import React, { useEffect } from "react";
import Hero from "../../Scenes/Home/Hero";
import Section from "../../components/Section/Section";
import Footer from "../../Scenes/Footer";

function Home() {
  useEffect(() => {
    const updateRentedStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/update-rented-status",
          {
            method: "GET",
            credentials: "include",
          }
        );
      } catch (error) {
        console.error("Error updating rented statuses:", error);
      }
    };

    updateRentedStatus();

    const interval = setInterval(updateRentedStatus, 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Hero />
      <Section />
      <Footer />
    </div>
  );
}

export default Home;
