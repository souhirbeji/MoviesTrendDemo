import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='search'>
      <div>
        <img src="./search.svg" alt="search icon" className="search-icon" />
        <input
          type="text"
          placeholder="Search for a movie"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Search;