import React from 'react'
import AnimeCard from './AnimeCard'

function Home(props) {
  return (
    <main>
        <div className='home-head'>
            <form 
            className='search-box'
            onSubmit={props.handleSearch} >
                <input 
                type="search"
                placeholder='Enter an anime...'
                required
                value={props.search}
                onChange={e => props.setSearch(e.target.value)}/>
            </form>
        </div>
        <div className="anime-list">
            {props.animeList.map((anime, index) => (
                <AnimeCard 
                anime={anime}
                // key={anime.mal_id} 
                key={index}
                />
            ))}
		</div>
    </main>
  )
}

export default Home