import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [cards, setCards] = useState([])
  

  

  async function getCards( index) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    const pokeData = await response.json()
    const url = pokeData.sprites.other['official-artwork'].front_default
    const name = pokeData.species.name;
    const id = pokeData.id;
    return {url, name, id}
  }
  
  // setCards(()=> {
  //   const newCards = JSON.parse(JSON.stringify(cards));
  //   newCards.push({url, name, id})
  //   //return newCards
  // })

  useEffect(() => {
    let tempCards = [];
    for (let i = 1; i <= 12; i++) {
      tempCards.push(i);
    }
  
    Promise.all(tempCards.map(index => getCards(index))).then(
      tempCards => setCards(tempCards)
    )
  },[])

  
  

  return (
    <>
      <div className='gameInfo'>
        <div className='gameTitle'>Pokeman Memory Card</div>
        <div className='gameResult'></div>
        <div className='scoreBoard'>
          <div className='currScore'>Score: </div>
          <div className='bestScore'>Best Score: </div>
        </div>
      </div>
      <div className='allCardsContainer'>
        {
          cards.map(card => {
            return (
              <div className='cardInfo' key={card.id} >
                <img src= {card.url} alt="pokeman Picture" />
                <div className='pokemanName'>{card.name}</div>
              </div>
            )
          })
        }
      </div>

    </>
  )
}

export default App
