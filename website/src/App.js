import React, { useState, useEffect } from "react";
import Home from "./components/Home"
import Header from "./components/Header"
import TopAnimeBar from "./components/TopAnimeBar";

function App() {

	const [animeList, setAnimeList] = useState([]);
	const [topAnime, setTopAnime] = useState([]);
	const [search, setSearch] = useState("");
	const[recommendationIDs, setRecommendationsIDs] = useState([])
	const[recommendationImages, setRecommendationsImages] = useState([])
	const[recommendationLinks, setRecommendationsLinks] = useState([])
	const [jikanAnimeList, setJikanAnimeList] = useState()

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
		// getAnimeFromJikanAPI(recommendationIDs);
	}

	const fetchAnime = async (query) => {
		const temp = await fetch(`/get_hybrid_recs?query=${query}`)
		.then(res => res.json());

		setAnimeList(temp);
		getAnimeIDs(temp);	
	}

	const getAnimeIDs = async(recommendationList) => {
		const animeIDs = await fetch(`/get_data_for_recommendations?query=${recommendationList}`[0])
		.then(res => res.json());

		setRecommendationsIDs(animeIDs);
	}

	const getAnimeImages = async(recommendationList) => {
		const animeImages = await fetch(`/get_data_for_recommendations?query=${recommendationList}`[1])
		.then(res => res.json());

		setRecommendationsImages(animeImages);
	}

	const getAnimeLinks = async(recommendationList) => {
		const animeLinks = await fetch(`/get_data_for_recommendations?query=${recommendationList}`[2])
		.then(res => res.json());

		setRecommendationsLinks(animeLinks);
	}

	// const getAnimeLinks = async(recommendationList) => {
	// 	const animeLinks = await fetch(`/get_ids_for_recommendations?query=${recommendationList}`)
	// 	.then(res => res.json());

	// 	setRecommendationsIDs(animeIDs);
	// }

	// const getAnimeFromJikanAPI = async (recommendationIDs) => {
	// 	let jikanAnimeList = [];

	// 	for(let i = 0; i < recommendationIDs.length; i++){
	// 		const temp = await fetch(`https://api.jikan.moe/v4/anime/${recommendationIDs[i]}`)//`https://api.jikan.moe/v4/anime/28891`
	// 		.then(res => res.json());

	// 		jikanAnimeList.push(temp);
	// 	}
	// 	console.log("JIKAN: ", jikanAnimeList)
	// 	setJikanAnimeList(jikanAnimeList)
		
	// 	// console.log("JIKAN LIST VALUE TEST: ", jikanAnimeList[0].data.url);
	// // }
	// console.log("JIKAN LIST: ", jikanAnimeList);

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
