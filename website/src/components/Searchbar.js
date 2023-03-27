import React, { useEffect, useState } from "react";
import "../assets/css/Searchbar.css";

function Searchbar(props) {
  const [animeTitles, setAnimeTitles] = useState([])

  const getAnimeTitles = async () => {
    const titles = await fetch('/get_anime_titles').then(
      resp => resp.json()
    )

    setAnimeTitles(titles)
  }

  useEffect(() => {
    getAnimeTitles()
  }, [])
  
  console.log(animeTitles)

  return (
    <div>
      <form className="search-box" onSubmit={props.handleSearch}>
        <input
          type="search"
          placeholder="Enter an anime..."
          required
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
        />
        <div className="search-results">
          {animeTitles.slice(0,15).map((title, index) => {
            return <p className="result-item">{title}</p>
          })}
        </div>
      </form>
    </div>
  );
}

export default Searchbar;
