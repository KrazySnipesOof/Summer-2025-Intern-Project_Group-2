import React from "react";
import { BiSearch } from 'react-icons/bi';
const SearchBar = ({ searchInp, handleSearch }) => {
  return (
    <div className="search-bar">
    <span className="icon"><BiSearch/></span>
      <input
        name="search"
        type="text"
        className="form-control"
        placeholder="Search User"
        value={searchInp}
        onChange={handleSearch}
      />
  </div>
  );
};

export default SearchBar;
