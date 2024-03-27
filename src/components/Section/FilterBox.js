import { useState, useEffect } from "react";
import "../../styles/FilterBox.css";
import { BiMap } from "react-icons/bi";
import { RiCarFill } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { ImPriceTags } from "react-icons/im";
import { TbBrandAsana } from "react-icons/tb";

const CATEGORIES = [
  { name: "Diesel" },
  { name: "Electric" },
  { name: "Hybrid" },
  { name: "Petrol" },
];

const OPTIONS = [
  { option: "4+ doors" },
  { option: "20+ inch wheels" },
  { option: "Full LED lighting" },
  { option: "Leather upholstery" },
];

const LOCATIONS = [
  { location: "Arad" },
  { location: "Timisoara" },
  { location: "Cluj-Napoca" },
];

const BRANDS = [
  { brand: "Audi" },
  { brand: "Tesla" },
  { brand: "Lamborghini" },
  { brand: "BMW" },
  { brand: "Porsche" },
];

function FilterBox({
  setSelectedCategory,
  setSelectedOption,
  setSelectedLocation,
  selectedCategory,
  selectedOption,
  selectedLocation,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  maxPrice,
  setMaxPrice,
  setMinPrice,
}) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setCategories(
      CATEGORIES.map((category) => ({ ...category, isChecked: false }))
    );
  }, []);

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;

    if (name === "allSelect") {
      setCategories(
        categories.map((category) => ({ ...category, isChecked: checked }))
      );
    } else {
      setCategories(
        categories.map((category) =>
          category.name === name
            ? { ...category, isChecked: checked }
            : category
        )
      );
    }
    if (!selectedCategory.includes(event.target.value)) {
      setSelectedCategory(selectedCategory + event.target.value);
    } else {
      let removedString = selectedCategory.replace(event.target.value, "");
      setSelectedCategory(removedString);
    }
  };

  const priceGap = 150;

  useEffect(() => {
    const rangeInput = document.querySelectorAll(".range-input input");
    const priceInput = document.querySelectorAll(".price-input input");
    const range = document.querySelector(".slider .progress");

    rangeInput.forEach((input) => {
      input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
          if (e.target.className === "range-min") {
            rangeInput[0].value = maxVal - priceGap;
          } else {
            rangeInput[1].value = minVal + priceGap;
          }
        } else {
          priceInput[0].value = minVal;
          priceInput[1].value = maxVal;
          const minPosition = (minVal / rangeInput[0].max) * 100;
          const maxPosition = (maxVal / rangeInput[1].max) * 100;
          range.style.left = `${minPosition}%`;
          range.style.right = `${100 - maxPosition}%`;
        }
      });
    });

    priceInput.forEach((input) => {
      input.addEventListener("input", (e) => {
        let minPrice = parseInt(priceInput[0].value);
        let maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
          if (e.target.className === "input-min") {
            rangeInput[0].value = minPrice;
            range.style.left = `${(minPrice / rangeInput[0].max) * 100}%`;
          } else {
            rangeInput[1].value = maxPrice;
            range.style.right = `${
              100 - (maxPrice / rangeInput[1].max) * 100
            }%`;
          }
        }
      });
    });
  }, []);

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };
  return (
    <div
      className="container-filterbox"
      style={{ width: "500px", height: "70%" }}
    >
      <div className="filter-container">
        <h1>Filters</h1>
        <button className="removeFilters-btn">Remove all filters</button>
      </div>
      <form className="form">
        <div className="categoryContainer-box">
          <div
            className="h3withiconsFilterbox"
            style={{ display: "flex", margin: "10px 0" }}
          >
            <RiCarFill style={{ marginRight: "10px" }} size={24} />
            <h3>Select Category</h3>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="allSelect"
              checked={!categories.some((category) => !category.isChecked)}
              onChange={handleCategoryChange}
            />
            <label className="form-check-label">All Select</label>
          </div>
          {categories.map((category) => (
            <div className="form-check" key={category.name}>
              <input
                type="checkbox"
                className="form-check-input"
                name={category.name}
                checked={category.isChecked}
                onChange={handleCategoryChange}
              />
              <label className="form-check-label">{category.name}</label>
            </div>
          ))}
        </div>
        <div className="categoryContainer-box">
          <div
            className="h3withiconsFilterbox"
            style={{ display: "flex", margin: "10px 0" }}
          >
            <BiMap style={{ marginRight: "5px" }} size={24} />
            <h3>Select location</h3>
          </div>
          {LOCATIONS.map((e) => {
            return (
              <div className="form-check" key={e.location}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="category"
                  value={e.location}
                  onChange={(event) => {
                    if (!selectedLocation.includes(event.target.value)) {
                      setSelectedLocation(
                        selectedLocation + event.target.value
                      );
                    } else {
                      let removedString = selectedLocation.replace(
                        event.target.value,
                        ""
                      );
                      setSelectedLocation(removedString);
                    }
                  }}
                />
                <label className="form-check-label">{e.location}</label>
              </div>
            );
          })}
        </div>
        <div className="categoryContainer-box">
          <div
            className="h3withiconsFilterbox"
            style={{ display: "flex", margin: "10px 0" }}
          >
            <FiSettings style={{ marginRight: "5px" }} size={24} />
            <h3>Select options</h3>
          </div>
          {OPTIONS.map((e) => {
            return (
              <div className="form-check" key={e.option}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="category"
                  value={e.option}
                  onChange={(event) => {
                    if (!selectedOption.includes(event.target.value)) {
                      if (selectedOption) {
                        setSelectedOption(
                          selectedOption + "," + event.target.value
                        );
                      } else {
                        setSelectedOption(event.target.value);
                      }
                    } else {
                      let removedString = selectedOption
                        .replace(event.target.value, "")
                        .replace(/^,|,$/g, "")
                        .replace(/,{2,}/g, ",");
                      setSelectedOption(removedString);
                    }
                  }}
                />
                <label className="form-check-label">{e.option}</label>
              </div>
            );
          })}
        </div>
        <div className="categoryContainer-box">
          <div
            className="h3withiconsFilterbox"
            style={{ display: "flex", margin: "10px 0" }}
          >
            <ImPriceTags style={{ marginRight: "5px" }} size={24} />
            <h3>Select price range</h3>
          </div>

          <p style={{ marginBottom: "10px", marginTop: "10px" }}>
            Use slider or enter min and max price
          </p>

          <div className="price-input">
            <div className="field">
              <span>Min</span>
              <input
                type="number"
                className="input-min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="separator">-</div>
            <div className="field">
              <span>Max</span>
              <input
                type="number"
                className="input-max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="slider">
            <div className="progress"></div>
          </div>
          <div className="range-input" style={{ marginBottom: "20px" }}>
            <input
              type="range"
              className="range-min"
              min="0"
              max="2000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="range"
              className="range-max"
              min="0"
              max="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="categoryContainer-box">
          <div
            className="h3withiconsFilterbox"
            style={{ display: "flex", margin: "10px 0" }}
          >
            <TbBrandAsana style={{ marginRight: "5px" }} size={24} />
            <h3>Select a brand</h3>
          </div>
          <div className="form-group" style={{ margin: "10px 0" }}>
            <label htmlFor="brandDropdown">Special filters:</label>
            <select
              id="brandDropdown"
              className="form-control select"
              value={selectedBrand}
              onChange={handleBrandChange}
              style={{ marginTop: "22px" }}
            >
              <option value="">-- Select Brand --</option>
              {BRANDS.map((brand, index) => (
                <option key={index} value={brand.brand}>
                  {brand.brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FilterBox;
