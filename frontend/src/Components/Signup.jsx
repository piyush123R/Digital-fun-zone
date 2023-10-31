import React from 'react'
import './signup.css'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import {LoginOutlined} from "@ant-design/icons"

const Signup = () => {

     const [name,setName]=useState('');
     const [email,setEmail]=useState('');
     const [password,setPassword]=useState('');
     const navigate=useNavigate()
     const [msg,setMsg]=useState('')

     const handleSubmit=((e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/register',{name,email,password})
          .then((result)=>
            {
                const val=result.data;
                setMsg(result.data)
                console.log(val)
                if(val==='Registration successful')
                {
                  navigate('/login')
                }
                else if(val==='Email already registered')
                {
                   setEmail('');
                }
            })
          .catch((err)=>console.log(err))
     })

  return (
     <div className="container">
         <h2>Sign up</h2>
         <form>
            <input type="text" placeholder='Enter name' onChange={(e)=>{setName(e.target.value)}}required /><br /> <br />
            <input type="email" placeholder='Enter email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required/> <br /> <br />
            <input type="password" placeholder='Set password'onChange={(e)=>{setPassword(e.target.value)}} required/> <br /> <br />
            <Button type="primary" onClick={handleSubmit}>Sing up</Button>
         </form>
         <p style={{color:'red'}}><strong>{msg}</strong></p>
         <Link to="/login">
         <Button type="primary" icon={<LoginOutlined />} >Login</Button>
         </Link>
     </div>
  );
}

export default Signup