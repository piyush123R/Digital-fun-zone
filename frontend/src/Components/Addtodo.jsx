import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Addtodo = () => {
  const email = useSelector((state) => state.user.email);
  const [task, setTask] = useState("");
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (task.length === 0) alert("Fill all details");
    else {
      var result=true;
      if (/cricket/gi.test(task) || /stock/gi.test(task)) {
        result = window.confirm("Want to add to to ToDo's?");
      }
      if (result === true) {
        axios
          .post("http://localhost:3001/addtodo", { email, task })
          .then((result) => {
            console.log(result);
            navigate("/remove", { state: { email } });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const regex = /stock/gi;
        if (regex.test(task)) navigate("/show");
        else if (/cricket/gi.test(task)) {
          navigate("/*");
        }
      }
    }
  };

  const myStyle = {
    border: "2px solid black",
    borderRadius: "5px",
    backgroundImage: "linear-gradient(red,orange, yellow)",
  };
  return (
    <div className="mx-3 mt-3 px-3" style={myStyle}>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={email} disabled />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
          onChange={(e) => {
            setTask(e.target.value);
          }}
        >
          <Form.Label>
            <strong>Write your To do</strong>
          </Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <Button variant="success" className="mb-3" onClick={handleClick}>
          ADD
        </Button>
      </Form>
    </div>
  );
};

export default Addtodo;
