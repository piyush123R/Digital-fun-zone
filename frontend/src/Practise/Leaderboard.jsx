import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import Table from "react-bootstrap/Table";
import { useSelector } from 'react-redux';


const Leaderboard = () => {
    const [users,setUsers]=useState([])
    const email=useSelector((state)=>state.user.email)
    useEffect(()=>{
         axios.get('http://localhost:3001/getrank')
          .then((result)=>{
            const val=result.data;
            val.sort((a,b)=> b.score-a.score)
            setUsers(val)
          })
          .catch((err)=>console.log(err))
    },[])
  return (
    <div className="mx-3 mt-3">
      
        {
            <Table striped bordered hover >
            <thead>
              <tr>
                <th>Rank</th>
                <th>Email</th>
                <th>Total score</th>
                <th>Total prediction</th>
              </tr>
            </thead>
            <tbody>
                {
                    users.map((user,index)=>{
                        return <tr key={index} style={user.email===email?{fontWeight:'bold'}:{}}>
                            <td>{index+1}</td>
                            <td>{user.email}</td>
                            <td>{user.score}</td>
                            <td>{user.count}</td>
                        </tr>
                    })
                }
            </tbody>
          </Table>
        }
    </div>
  )
}

export default Leaderboard