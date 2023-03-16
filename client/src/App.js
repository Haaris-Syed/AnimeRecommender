import React, { useState, useEffect } from "react"

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/members")
      .then(
        res => res.json()
      )
      .then(data => {
        setData(data);
        console.log(data);
        }
      )
  }, [])

  const [anime, setAnime] = useState([{}])

  useEffect(() => {
    fetch("/test_data")
      .then(
        res => res.json()
      )
      .then(anime => {
        setAnime(anime);
        console.log(anime);
        }
      )
  }, [])

  return (
    <div>

      {(typeof data.members === 'undefined') ? (
          <p>Loading...</p>
      ) : (
          data.members.map((member, i) => (
            <p key = {i}>{member}</p>
          ))
      )}
    <div>
    {(typeof data.members === 'undefined') ? (
          <p>Loading Anime...</p>
      ) : (
          anime.map((anime_title) => {
            return(
              <p>{anime_title}</p>
            )
          })
      )}
    </div>
    </div>

    
  )
  
}

export default App
