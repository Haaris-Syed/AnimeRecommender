import React, { useState, useEffect } from 'react'
import AnimeCard from './AnimeCard'

function Home(props) {
	const [animeList, setAnimeList] = useState([])

	useEffect(() => {
		getAnimeValues();
	}, [])

	const getAnimeValues = async () => {
		let anime = []

		for (let key in props.animeList){
			anime.push(props.animeList[key])
		}
		console.log("ANIME LIST: ", anime)
		setAnimeList(anime)
	}

	console.log("UPDATED: ", animeList)

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
			{animeList.map((anime) => (
				<AnimeCard 
				anime={anime.title}
				// key={anime.mal_id} 
				key={anime.mal_id}
				/>
			))}
		</div>
	</main>
	)
	}

export default Home