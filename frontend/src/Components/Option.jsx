import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import axios from "axios";
const Option = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState();
  const email = useSelector((state) => state.user.email);
  const [cnt, setCnt] = useState(0);
  const newStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getcnt", { params: { email, index: -1 } })
      .then((result) => {
        console.log(result);
        setCnt(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/remove");
  };

  const validateClick = (e) => {
    e.preventDefault();
    if (email === null) navigate("/login");
    else {
      const val = prompt("Enter passcode");
      if (val === "cc3") navigate("/antd");
      else alert("Passcode is wrong");
    }
  };

  const newChat = (e) => {
    e.preventDefault();
    if (email === null) {
      navigate("/login");
      return;
    }
    var newEmail = prompt("Enter mail id you want to connect");
    if (newEmail === null) return;
    if (newEmail.length > 0) {
      axios
        .get("http://localhost:3001/checkuser", { params: { newEmail } })
        .then((users) => {
          console.log(users);
          const arr = users.data;
          if (arr.length === 0) {
            setMsg("*Email not registerd with this app");
          } else {
            navigate("/chat", { state: { newEmail } });
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("Enter a valid email");
    }
  };

  return (
    <div>
      <h3 style={{ color: "red", margin: "15px", alignText: "center" }}>
        {msg}
      </h3>
      <div className="mx-3 mt-3" style={newStyle}>
        <Button
          variant="primary"
          className="mx-2 px-3 mb-3"
          onClick={(e) => {
            e.preventDefault();
            navigate("/addtodo");
          }}
        >
          Add Todo's
        </Button>{" "}
        <Button
          variant="danger"
          className="mx-2 px-3 mb-3"
          onClick={(e) => handleClick(e)}
        >
          Active Todo's
        </Button>{" "}
        <Button
          variant="success"
          className="mx-2 px-3 mb-3"
          onClick={(e) => {
            e.preventDefault();
            navigate("/done");
          }}
        >
          Completed Todo's
        </Button>{" "}
        <Button
          variant="warning"
          className="mx-2 px-3 mb-3"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Home");
          }}
        >
          Info
        </Button>{" "}
        <Button
          variant="primary"
          className="mx-2 px-3 mb-3"
          onClick={validateClick}
        >
          Group Chat{" "}
          {cnt > 0 ? (
            <Badge count={cnt}>
              <BellOutlined style={{ fontSize: "24px" }} />
            </Badge>
          ) : null}
        </Button>{" "}
        <Button variant="dark" className="mx-2 px-3 mb-3" onClick={newChat}>
          Personal chat{" "}
        </Button>{" "}
        <Button
          variant="info"
          className="mx-2 px-3 mb-3"
          onClick={(e) => {
            e.preventDefault();
            navigate("/multi");
          }}
        >
          Fun game{" "}
        </Button>{" "}
        <Button
          style={{backgroundColor:'#fc30f6',border:'none'}}
          className="mx-2 px-3 mb-3"
          onClick={(e) => {
            e.preventDefault();
            navigate("/game");
          }}
        >
          Predict if you can{" "}
        </Button>{" "}
      </div>
    </div>
  );
};

export default Option;
