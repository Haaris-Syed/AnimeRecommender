import React, { useEffect, useState } from "react";
import "../assets/css/Searchbar.css";

function Searchbar(props) {
  const [animeTitles, setAnimeTitles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getAnimeTitles = async () => {
    const titles = await fetch("/get_anime_titles").then((resp) => resp.json());

    setAnimeTitles(titles);
  };

  useEffect(() => {
    getAnimeTitles();
  }, []);

  const handleFilter = (e) => {
    const searchTerm = e.target.value;
    const filteredTitles = animeTitles.filter((title) => {
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchTerm === "") {
      setFilteredData([]);
    } else {
      setFilteredData(filteredTitles);
    }
    props.setSearch(searchTerm);
  };

  const autoComplete = (search) => {
    props.setSearch(search)
  }

  return (
    <div>
      <form className="search-box" onSubmit={props.handleSearch}>
        <input
          type="search"
          placeholder="Enter an anime..."
          required
          value={props.search}
          onChange={handleFilter}
        />
        {filteredData.length !== 0 && (
          <div className="search-results">
            {filteredData.slice(0, 15).map((title, index) => {
              return <p className="result-item" 
              onClick={() => autoComplete(title)}
              key={index}>
                {title}
                </p>;
            })}
          </div>
        )}
      </form>
    </div>
  );
}

export default Searchbar;
