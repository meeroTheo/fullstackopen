import React from "react";
import { useState } from "react";
const Country = ({ country }) => {
  //{JSON.stringify(country.capital, null, 2)}
  const { name, capital, area, languages, flags } = country;
  const [weather, setWeather] = useState("");

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY;
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
      )
      .then((res) => setWeather(res.data));
  }, [capital]);

  return (
    <div className="countryInfo">
      <h1> {name.common} </h1>
      <div>capital {capital}</div>
      <div>area {area}</div>
      <div>
        <h4>languages:</h4>
        <ul>
          {Object.entries(languages).map(([code, language]) => (
            <li key={code}>{language}</li>
          ))}
        </ul>
      </div>
      <img
        className="flags"
        src={flags.svg}
        alt={`${country.name.common} flag`}
      />
    </div>
  );
};
export default Country;
