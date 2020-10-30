import { useEffect, useState, useRef} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import MeraCanvas from './canvas';
import react from 'react'


const ENDPOINT = 'https://infinite-shelf-23652.herokuapp.com/'

  
let socket;

let x = 0;


function App() {

  
  
const [reciever, setReciever] = useState(true)
const canvas2Ref = useRef(null)
const [room, setRoom] = useState('')
const [name, setName] = useState('')
const [players, setPlayers] = useState([])
const [messages, setMessages] = useState([])
const [newMessage, setNewMessage] = useState(false)
const [currentChance, setCurrentChance] = useState("")
const [timer, setTimer] = useState(0)


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
     console.log(players)
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
    mantainTimer()
    
    console.log('starting')
    setPlayers(players => {
      setCurrentChance(players[x])
      return players
    }) 
    
    
   let myInterval =  setInterval(() => { 
    x++  
    setPlayers(players => {
      if(x == players.length) {
        clearInterval(myInterval)
        setCurrentChance("")
      }
      setCurrentChance(players[x])
      return players
    })   
    
     
    }, 20000);
    




  })


}, [])
  

const mantainTimer = () => {
  
  let myInter =  setInterval(()=> {
    setTimer(timer =>{
      if(timer == 20) {clearInterval(myInter)
      return timer} 
      return timer +1
    } )
     
 }, 1000)

 
 
}






const startGame =  () => {
   if(players.length>1) {
    
    socket.emit("gameStarted", () => [
      console.log(socket.id)
    ])
    
      
   console.log(players, currentChance, socket.id)
}
else {
  alert("only 1 player in the room")
}
}
  
  


  

  
  const dothis = (data) => {
  console.log("hettig")
    console.log(socket.id)
    socket.emit('sendPaint', data) 
  
}
  

 
  


  return (
    <div>
    <h1>room is {room}</h1>
    { 
     (currentChance) ?  
     <div>
       {
      ( !(currentChance.id === socket.id)) ? <canvas ref = {canvas2Ref}style ={{border : "solid 2px black"}} ></canvas> :
      <div>
        <h3>It's your turn</h3>
         <MeraCanvas givePixelData = {dothis} socket={socket}/>
       </div> }
    </div> : null
    }
     {
       messages.map(message => 
       <p> {message.text} </p> 
       )
     }
    
    <button onClick = {startGame}>Start</button>
    
    <p>{timer}</p>
  </div>
  )
}


export default App;
