import React from "react";
const SearchCountry = ({ filter, handleChange }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleChange} />
    </div>
  );
};
export default SearchCountry;
