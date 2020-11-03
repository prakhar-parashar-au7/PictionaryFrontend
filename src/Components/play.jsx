import { useEffect, useState, useRef} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import MeraCanvas from './canvas';
import react from 'react'
import ChooseWord from './ChooseWord'
import Timer from './timer'
import { Button, TextField } from '@material-ui/core';
import WordModal from './WordModal'
import PlayersInRoom from './playersInRoom'



const ENDPOINT = 'https://infinite-shelf-23652.herokuapp.com/'

  
let socket;

let y = 0;


function App() {

  
const [reciever, setReciever] = useState(true)
const canvas2Ref = useRef(null)
const [room, setRoom] = useState('')
const [name, setName] = useState('')
const [players, setPlayers] = useState([])
const [messages, setMessages] = useState([])
const [newMessage, setNewMessage] = useState(false)
const [currentChance, setCurrentChance] = useState("")
const [chosenWord, setChosenWord] = useState("")
const [timerStart, setTimerStart] = useState(false)
const childRef = useRef()
const [guessedWord, setGuessedWord] = useState("")
const [wordModal, setWordModal] = useState(false)




useEffect(() => {

   const {name, room} = queryString.parse(window.location.search)
   socket = io(ENDPOINT)
   
   setName(name)
   setRoom(room)
  
  
  socket.emit('join', {name, room}, (error) => {
   
     if(error) {
       alert(error)
     }
   });
  }, [ENDPOINT, window.location.search]);


  useEffect(() => {

   socket.on("roomData", ({ players }) => {
    
       setPlayers(players);
   })

   socket.on("message", (message) => {  
     const newMessages = [...messages, message]
     setMessages(messages => [ ...messages, message ]);
   })

  


  




   socket.on('paint', ({player,paintDataBuffer}) => {
     console.log("painting")
    const paintData =  new Uint8ClampedArray(paintDataBuffer);
    setReciever(true)

    const ctx = canvas2Ref.current.getContext("2d")
    
    const newImageData = new ImageData(paintData, ctx.canvas.width, ctx.canvas.height)
 
     ctx.putImageData(newImageData, 0, 0)
  })

 



   }, [])


useEffect(() => {
  
  socket.on("gameStarted", () => {
  //  setTimerStart(true)
    

    console.log('starting')
    setPlayers(players => {
      setCurrentChance(players[y])
      return players
    }) 
  

  })

  socket.on('chosenWord', (data) => {
    setChosenWord(data)
    childRef.current.mantainTimer()
    timeUp()
  })


}, [])
  





const timeUp = () => {
  
 setTimeout(() => {

  console.log("before", y)
  console.log(players)
  y++
  console.log(players) 
  console.log("after",y)
  setPlayers(players => {
    setCurrentChance(players[y])
    return players
   
  })
  whatwastheword()
  setTimeout(() => {
    setWordModal(false)
  }, 5000); 
 
  setChosenWord("")
  console.log("last",y)
   
 }, 20000);

  
  // debugger;
  // console.log(x)
  // console.log("called")
  //  setTimeout(() => {
   
  //   if(!(x == players.length)){
  //     
  //     
  //     console.log(players)
  //     console.log(x-1)
  //     console.log(players[x-1])
  //     
  //     
      
  //     }
  //   }, 5000);
      
  
    }





useEffect(() => {
  console.log(y)
console.log(currentChance)
}, [currentChance])

 
 
useEffect(() => {
  //console.log(y)
console.log(players)
}, [players])
   





const startGame =  () => {
   if(players.length>1) {
    
    socket.emit("gameStarted")
    
      
  
}
else {
  alert("only 1 player in the room")
}
}
  
  


  

  
  const dothis = (data) => {
    socket.emit('sendPaint', data) 
  
}
  


const choseWord= (word) => {
     setChosenWord(word)
     childRef.current.mantainTimer()
     socket.emit("chosenWord", word)
     timeUp()
}
 
const guessWord = (e) => {
   setGuessedWord(e.target.value)
}


const checkGuessedWord = () => {
  console.log(guessedWord, chosenWord)
  if (guessedWord == chosenWord) {
     alert("you're right")
  }
}



const whatwastheword = () => {
  setWordModal(true)
}


  return (
    <div id="play">
    
    <div>
    <h3>room is {room}</h3>
     <PlayersInRoom players = {players}/>
     </div>
     <div>
       {
      ( currentChance && (currentChance.id === socket.id)) ?

      <div style={{textAlign : "center"}}>
      <h3>It's your turn</h3>
      {
        (chosenWord == "") ? <ChooseWord choseWord = {choseWord}/> : <div>
          You're drawing {chosenWord}
        </div>
      }
       <MeraCanvas givePixelData = {dothis} socket={socket}/>
     </div> :
      <div>
      
      <canvas ref = {canvas2Ref}style ={{border : "solid 2px black"}} ></canvas> 
      <WordModal 
    word = {chosenWord}
    show= {wordModal}
    onHide = {()=> setWordModal(false)} 
    />
      </div>
      
      
      }
      </div>
    <div>
    <TextField placeholder = "guess the word" onChange = {guessWord}/>
       <Button  variant="contained" color="primary" onClick = {checkGuessedWord}>
         check
       </Button>
     {
       messages.map(message => 
       <p> {message.text} </p> 
       )
     }
    
    <button onClick = {startGame}>Start</button>
    
    <Timer ref={childRef}/>
    
   <button onClick = {timeUp}>Debug</button>
  </div>
  </div>
  )
}


export default App;
