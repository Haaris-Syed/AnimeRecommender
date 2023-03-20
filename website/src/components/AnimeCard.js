import React from 'react'

function AnimeCard(props) {
  return (
    <article className="anime-card">
			<a 
				href={props.animeLink} 
				target="_blank" 
				rel="noreferrer">
				<figure>
					<img 
						src={props.animeImage} 
						alt="Anime" />
				</figure>
				<h3>{ props.anime }</h3>
			</a>
			{/* <p>{anime}</p> */}
		</article>
  )
}

export default AnimeCard