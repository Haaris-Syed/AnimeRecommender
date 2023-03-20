import React, { useState, useEffect } from "react";
import Home from "./components/Home"
import Header from "./components/Header"
import TopAnimeBar from "./components/TopAnimeBar";

function App() {

	const [animeList, setAnimeList] = useState([]);
	const [topAnime, setTopAnime] = useState([]);
	const [search, setSearch] = useState("");
	const[animeIDs, setAnimeIDs] = useState([])
	const[animeImages, setAnimeImages] = useState([])
	const[animeLinks, setAnimeLinks] = useState([])

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
		const temp = await fetch(`/get_hybrid_recs?query=${query}`)
		.then(res => res.json());

		setAnimeList(temp);
		getAnimeIDs(temp);
		getAnimeImages(temp);
		getAnimeLinks(temp);
	}

	const getAnimeIDs = async(recommendationList) => {
		const animeIDs = await fetch(`/get_ids_for_recommendations?query=${recommendationList}`)
		.then(res => res.json());

		setAnimeIDs(animeIDs);
	}

	const getAnimeImages = async(recommendationList) => {
		const animeImages = await fetch(`/get_images_for_recommendations?query=${recommendationList}`)
		.then(res => res.json())

		setAnimeImages(animeImages);
	}

	const getAnimeLinks = async(recommendationList) => {
		const animeLinks = await fetch(`/get_links_for_recommendations?query=${recommendationList}`)
		.then(res => res.json());

		setAnimeLinks(animeLinks);
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
					animeList={animeList}
					animeIDs={animeIDs}
					animeImages={animeImages}
					animeLinks={animeLinks}
					/>
			</div>
		</div>
	);
}

export default App;
