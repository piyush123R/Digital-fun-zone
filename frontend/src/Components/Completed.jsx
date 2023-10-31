import React from 'react'
import axios from 'axios';
import './Completed.css'
import { useState , useEffect } from 'react';
import { useSelector } from 'react-redux';

const Completed = () => {

  
   const email=useSelector(state=> state.user.email)
   const [lists,setLists]=useState([])
   useEffect(()=>{
        console.log(email);
        axios.get('http://localhost:3001/getdeleted',{params:{email},})
          .then((result)=> setLists(result.data))
          .catch((err)=>console.log(err))
   },[email]);
  return (
    <div className='tasks1'>
      <h1>Completed Todo's </h1>
        {
          lists.map((list,index)=>{
             return <div key={index}>
                 <h5>{list.email}</h5>
                 <p>{list.task}</p>
                 
             </div>
          })
        }
    </div>
  )
}

export default Completed