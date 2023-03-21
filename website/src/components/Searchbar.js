import React from 'react'
import '../assets/css/Searchbar.css';

function Searchbar(props) {
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
        </form>
    </div>
  )
}

export default Searchbar