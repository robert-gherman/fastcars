import React from "react";
import CarList from "./CarList";
import FilterBox from "./FilterBox";
import { useState } from "react";

const Section = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(1500);

  return (
    <div
      style={{
        display: "flex",
        margin: "0 30px",
      }}
    >
      <FilterBox
        setSelectedCategory={setSelectedCategory}
        setSelectedOption={setSelectedOption}
        setSelectedLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
        selectedCategory={selectedCategory}
        selectedOption={selectedOption}
        setSelectedBrand={setSelectedBrand}
        selectedBrand={selectedBrand}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
      />
      <CarList
        selectedCategory={selectedCategory}
        selectedOption={selectedOption}
        selectedLocation={selectedLocation}
        selectedBrand={selectedBrand}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  );
};
export default Section;
