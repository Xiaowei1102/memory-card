import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [cards, setCards] = useState([])
  const [clickedCards, setClickedCards] = useState(new Set())
  const [currScore, setCurrScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  

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

  //compare the updated current score to best score and update
  useEffect(() =>{
    if (bestScore < currScore) {
      setBestScore(currScore)
    }
  },[currScore, bestScore])
  //use Fisher-Yates shuffle (basically walk the array in reverse order and swap each element with a random one)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      //find a random index from 0 to i
      // let random = Math.random();
      // let oneMore = i + 1;
      // let oneMoreTimesRandom = oneMore * random;
      // let jfloor = Math.floor(oneMoreTimesRandom);
      // let j = jfloor;
      let j = Math.floor(Math.random() * (i + 1));
      // let iVal = array[i];
      // let jVal = array[j];
      // array[i] = jVal;
      // array[j] = iVal;
      // let temp = array[i];
      // array[i] = array[j];
      // array[j] = temp;
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  function handleClick(e) {
    //if the game is over, new clicks wont do anything
    const gameResult = document.querySelector('.gameResult')
    if (clickedCards.size === 12 || gameResult.innerHTML === 'Game over!') {
      return;
    }
    //check if this card has been clicked before and update score and best score
    if (!clickedCards.has(e.target.className)) {
      gameResult.innerHTML = ''
      clickedCards.add(e.target.className)
      if (clickedCards.size === 12) {
        gameResult.innerHTML = 'You win!'
      } 
      console.log(cards.filter(card => !clickedCards.has(card.name)).map(card => card.name))
      setCurrScore(currScore => currScore + 1)
    } else {
      gameResult.innerHTML = 'Game Over!'
    }
    setCards(()=> {
      const newCards = JSON.parse(JSON.stringify(cards));
      //shuffle the image array 
      shuffle(newCards);
      return newCards;
    })
  }
  
  function handleNewRound() {
    setCurrScore(0)
    setClickedCards(new Set())
  }
   

  return (
    <>
      <div className='gameInfo'>
        <div className='gameTitleAndScore'>
          <div className='gameTitle'>Pokeman Memory Card</div>
          <div className='scoreBoard'>
            <div className='currScore'>Score: {currScore}</div>
            <div className='bestScore'>Best Score: {bestScore}</div>
          </div>
        </div>
        <div className='gameResultAndButton'>
          <div className='gameResult'>Start clicking! Just do not click the same Pokeman twice!</div>
          <button className='newGame' onClick={handleNewRound}>New Round</button>
        </div>
      </div>
      <div className='allCardsContainer'>
        {
          cards.map(card => {
            return (
              <div className='cardInfo' key={card.id} >
                <img src= {card.url} alt="pokeman Picture" className= {card.name} onClick={handleClick}/>
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
