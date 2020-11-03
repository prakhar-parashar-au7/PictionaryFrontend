import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './styles/Join.css';
import { isWidthDown, TextField } from '@material-ui/core';
import { Button } from 'react-bootstrap';

export default function SignIn() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="joinOuterContainer">

  
      <div className="joinInnerContainer">
       <div id="joinText">
        <h1 className="heading">Join</h1>
           <h6>or</h6>
        <h4>  Create a Room </h4>
        </div>
        <div >
        <TextField style = {{backgroundColor : "white"}} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => setName(event.target.value)}/>
        </div>
        <div style={{margin: "20px"}}>
        <TextField  style = {{backgroundColor : "white"}}  id="outlined-basic" label="Room" variant="outlined" onChange={(event) => setRoom(event.target.value)}/>
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/play?name=${name}&room=${room}`}>
          <Button className={'button mt-20'} type="submit">Get In</Button>
        </Link>
      </div>
    </div>
    
  );
}