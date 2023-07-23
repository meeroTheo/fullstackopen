import React from "react";

const Countries = ({ countries, onClick }) => {
  if (!countries) {
    // If countries is null, you can return a loading message or fallback content.
    return null;
  }
  if (countries.length >= 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  return (
    <div>
      {countries.map((country, i) => (
        <div key={i}>
          {country.name.common}
          <button
            onClick={() => {
              onClick(country.name.common);
            }}
          >
            Show
          </button>
        </div>
      ))}
    </div>
  );
};
export default Countries;
