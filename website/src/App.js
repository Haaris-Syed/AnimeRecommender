import React, { useState, useEffect } from "react";
import Home from "./components/Home"
import Header from "./components/Header"
import TopAnimeBar from "./components/TopAnimeBar";

function App() {
	// const [recommendationsIsLoading, setRecommendationsIsLoading] =
	// 	useState(true);
	// const [recommendations, setRecommendations] = useState([{}]);

	// useEffect(() => {
	// 	fetch("/get_hybrid_recs")
	// 		.then((res) => res.json())
	// 		.then((recommendations) => {
	// 			setRecommendations(recommendations);
	// 			setRecommendationsIsLoading(false);
	// 			console.log(recommendations);
	// 		});
	// }, []);

	const [animeList, setAnimeList] = useState([]);
	const [topAnime, setTopAnime] = useState([]);
	const [search, setSearch] = useState("");

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

	const fetchAnime = async (query) => {
		const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&
		sort=asc`)
		.then(res => res.json());

		setAnimeList(temp.data);
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
