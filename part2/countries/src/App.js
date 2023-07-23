import { useState, useEffect } from "react";

import SearchCountry from "./components/SearchCountry";
import Country from "./components/Country";
import Countries from "./components/Countries";
import axios from "axios";
import "./index.css";

const App = () => {
  const [countries, setCountries] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("fetching countries");
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleShow = (country) => {
    setFilter(country);
  };
  const countryToShow =
    filter &&
    countries.filter((country) =>
      country.name.common?.toLowerCase().match(filter?.toLowerCase())
    );

  return (
    <div>
      <SearchCountry filter={filter} handleChange={handleFilterChange} />

      {countryToShow.length === 1 ? (
        <Country country={countryToShow[0]} />
      ) : (
        <Countries countries={countryToShow} onClick={handleShow} />
      )}
    </div>
  );
};

export default App;
