import React from 'react'
import Form from "react-bootstrap/Form";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Updates = () => {
     
    const location=useLocation();
    const navigate=useNavigate();
    const list=location.state?.tasks;
    const id=location.state?.id;
    const email=location.state?.email;
    const [task,setTask]=useState(list)

    const handleClick=((e)=>{
        e.preventDefault()
        axios.put('http://localhost:3001/update/'+id,{email,task})
          .then((result)=>{
            console.log(result);
             navigate('/remove',{state:{email}})
           })
          .catch((err)=>console.log(err))
    })

    const myStyle = {
        border: "2px solid black",
        borderRadius: "5px",
        backgroundImage: "linear-gradient(red,orange, yellow)",
      };
  return (
    <div className="mx-3 mt-3 px-3" style={myStyle}>
        <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" >
          <Form.Label>
            <strong>Update your To do</strong>
          </Form.Label>
          <Form.Control as="textarea" rows={3} value={task} onChange={(e)=>(setTask(e.target.value))}/>
        </Form.Group>
        <Button  variant="primary" className="mb-3" onClick={handleClick}>Update</Button>
      </Form>
    </div>
  )
}

export default Updates