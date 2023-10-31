import React from "react";
import Table from "react-bootstrap/Table";
import { useState ,useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import './Home.css'

const Home = () => {
  const [users,setUsers]=useState([]);
  const email=useSelector(state=> state.user.email);

  
  useEffect(()=>{
    axios.get('http://localhost:3001/getuser')
      .then((users)=>{
        console.log(users)
        setUsers(users.data)
      })
      .catch((err)=>console.log(err))
  },[])
  return (
    <div className="mx-3 mt-3">
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user, id) => {
            return <tr key={id}  className={user.email === email ? "login" : "" }>
               <td>{id+1}</td>
               <td >{user.name}</td>
               <td>{user.email}</td>
               <td>{user.password}</td>
             </tr>;
            })
          }
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
