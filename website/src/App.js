import React, { useState, useEffect } from "react";
import Home from "./components/Home"
import Header from "./components/Header"
import TopAnimeBar from "./components/TopAnimeBar";

function App() {

	const [animeList, setAnimeList] = useState([]);
	const [topAnime, setTopAnime] = useState([]);
	const [search, setSearch] = useState("");
	const[recommendationIDs, setRecommendationsIDs] = useState([])

	const getTopAnime = async () => {
		const temp = await fetch(`https://api.jikan.moe/v4/top/anime`)
		.then(res => res.json());

		setTopAnime(temp.data.slice(0, 5));
	}

	useEffect(() => {
			getTopAnime();
		}, [])

	const handleSearch = e => {
		e.preventDefault();

		fetchAnime(search);
	}

	// const fetchAnime = async (query) => {
	// 	const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&
	// 	sort=asc`)
	// 	.then(res => res.json());

	// 	setAnimeList(temp.data);
	// }

	const fetchAnime = async (query) => {
		const temp = await fetch(`/get_hybrid_recs?query=${query}`)
		.then(res => res.json());

		setAnimeList(temp);
		getAnimeIDs(temp)
		getAnimeFromJikanAPI();
	}

	const getAnimeIDs = async(recommendationList) => {
		const animeIDs = await fetch(`/get_ids_for_recommendations?query=${recommendationList}`)
		.then(res => res.json());

		setRecommendationsIDs(animeIDs)
	}

	const getAnimeFromJikanAPI = async () => {
		const temp = await fetch(`https://api.jikan.moe/v4/anime?query=Haikyuu Karasuno Koukou vs Shiratorizawa Gakuen Koukou`)//`https://api.jikan.moe/v4/anime/28891`
			.then(res => res.json());
		
		console.log("HAIKYUU?: ", temp);
	}

	return (
		<div className="App">
			<Header />
			<div className="content-wrap">
				<TopAnimeBar topAnime={topAnime}/>
				<Home 
					handleSearch={handleSearch}
					search={search}
					setSearch={setSearch}
					animeList={animeList}/>
			</div>
		</div>
	);
}

export default App;
