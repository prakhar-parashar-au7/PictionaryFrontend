import react, {useState} from 'react'


const PlayersInRoom = (props) => {


    return(
        
        props.players.map((player, index) => 
           <div style={{textAlign : "center"}}>
               
               <img src={process.env.PUBLIC_URL + `/${player.imageId}.png`} alt="logo" width="50p" height="50px" />
               <p>{player.name}</p>
           </div> 
            )
        

    )
}

export default PlayersInRoom