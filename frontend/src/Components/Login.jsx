import React from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userEmail } from "../actions";
import { Button } from "antd";
import {LoginOutlined} from "@ant-design/icons"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg,setMsg]=useState("")
  const [loadings,setLoadings]=useState(false)
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadings(true)
    axios
      .post("http://localhost:3001/Login", { email, password })
      .then((result) => {
        const status = result.data;
        if (status === "Login successful") {
          console.log(email);
          dispatch(userEmail(email))
          setLoadings(false)
          navigate("/options");
        } 
        else if (status === "Incorrect password") 
        {
          setMsg("Incorrect password")
          setLoadings(false)
          setPassword('')
        } 
        else {
          setMsg("Email is not registered")
          setTimeout(()=>{
            setLoadings(false)
            navigate("/signup")
          },2000)
          
        }
      })
      .catch((err) => {
        setLoadings(false)
        console.log(err)
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form action="POST">
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />{" "}
        <br /> <br />
        <input
          type="password"
          placeholder="Set password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />{" "}
        <br /> <br />
         <Button type="primary" icon={<LoginOutlined />} loading={loadings}  onClick={handleSubmit}>Login</Button>
      </form>
      <p style={{color:'red'}}><strong>{msg}</strong></p>
      <Link to="/signup">
        <Button type="primary"> Sign up</Button>
      </Link>
    </div>
  );
};

export default Login;
