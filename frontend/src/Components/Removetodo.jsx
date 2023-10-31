import React from 'react'
import './Removetodo.css'
import { useState,useEffect } from 'react'
import axios from 'axios'
import './Removetodo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Removetodo = () => 
{
   const navigate=useNavigate()
   
   const email=useSelector(state=> state.user.email);
   const [lists,setLists]=useState([])
   const [count,setCount]=useState(0);
   useEffect(()=>{
        console.log(email);
        axios.get('http://localhost:3001/getlist',{params:{email},})
          .then((result)=> setLists(result.data))
          .catch((err)=>console.log(err))
   },[count,email]);

  const delList=((e,id,task)=>{
      e.preventDefault()
      var x=window.confirm('Are you sure you want to delete this?')
      if(x===true)
      {
          axios.delete('http://localhost:3001/dellist/'+id)
            .then((result)=>
             {
               setCount(count+1);
               console.log(result)
             })
            .catch((err)=>console.log(err))

          axios.post('http://localhost:3001/deleted',{email,task})
             .then((result)=>console.log(result))
             .catch((err)=>console.log(err))
      }
  })

  const updateList=((e,id,tasks)=>{
    e.preventDefault();
    console.log(tasks);
    navigate('/update',{state:{tasks,id,email}})
    
  })
 
  return (
    <div className='tasks'>
      
           <h1>Active Todo's </h1>
        {
          lists.map((list,index)=>{
             return <div key={index}>
                 <h5>{list.email}</h5>
                 <p>{list.task}</p>
                 <FontAwesomeIcon icon={faTrash} className='icon'onClick={(e)=>delList(e,list._id,list.task)}/>
                 <FontAwesomeIcon icon={faPenToSquare} className='icon1'onClick={(e)=>updateList(e,list._id,list.task)}/>
                 <br />
                 
             </div>
          })
        }
    </div>
  )
}

export default Removetodo