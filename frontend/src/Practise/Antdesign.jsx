import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Divider } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { UsergroupDeleteOutlined } from "@ant-design/icons";
import "./antidesign.css";
import axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

const Antdesign = () => {
  const [view, setView] = useState([]);
  const [msg, setMsg] = useState("");
  const [color, setColor] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [cnt, setCnt] = useState(0);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const email = useSelector((state) => state.user.email);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current.click();
    }
  };
 var call=0;
  const updateLog = () => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    if (email === null) {
      alert("Login first to view the message");
      return;
    }
    axios
      .get("http://localhost:3001/getmessage")
      .then((result) => {
        const arr = result.data;
        setView(arr);
      })
      .catch((err) => console.log(err));
  };
  const handleUpdate = (e) => {
    
    axios
      .get("http://localhost:3001/getcnt", { params: { email ,index:1} })
      .then((result)=> call++)
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    setColors();
    handleUpdate()
    if (email === null) {
      alert("Login first to view the message");
      return;
    }
    axios
      .get("http://localhost:3001/getmessage")
      .then((result) => {
        const arr = result.data;
        setView(arr);
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 0);
      })
      .catch((err) => console.log(err));
  }, [email]);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
      if (email === null) {
        alert("Login first to view the message");
        return;
      }
      axios
        .get("http://localhost:3001/getmessage")
        .then((result) => {
          const arr = result.data;
          console.log("view changes");
          setView(arr);
        })
        .catch((err) => console.log(err));
        handleUpdate()
    }, 30000);
  }, [view, email]);

  const handleClick = (e) => {
    e.preventDefault();
    setMsg("");
    const time = new Date();
    const val = `${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const date = time.toLocaleDateString();
    const newMail = email;
    if (msg.length > 0) {
      axios
        .post("http://localhost:3001/savemessage", {
          newMail,
          msg,
          val,
          date,
        })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    }
    setEmojis([]);
    updateLog();
  };

  const addToDo = (e, task) => {
    e.preventDefault();
    var choice = window.confirm(`Want to add **${task}** to ToDo's `);
    if (choice === false) return;
    if (email === null) alert("First login to perfom this action");
    else if (choice === true) {
      axios
        .post("http://localhost:3001/addtodo", { email, task })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    }
  };

  const setColors = () => {
    const colors = [
      "red",
      "blue",
      "green",
      "orange",
      "purple",
      "pink",
      "brown",
      "gray",
      "black",
      "cyan",
      "magenta",
      "lime",
      "teal",
      "indigo",
      "violet",
      "maroon",
      "navy",
      "olive",
      "aqua",
      "coral",
      "gold",
      "orchid",
      "peru",
      "plum",
      "salmon",
      "sienna",
      "tan",
      "thistle",
    ];

    axios
      .get("http://localhost:3001/getuser")
      .then((users) => {
        const arr = users.data;
        arr.forEach((item) => {
          const index = Math.floor(Math.random() * colors.length);
          setColor((prev) => ({
            ...prev,
            [item.email]: colors[index],
          }));
        });
      })
      .catch((err) => console.log(err));
  };

  const handleEmojiClick = (e) => {
    e.preventDefault();
    var arr = [
      "😂",
      "❤️",
      "😍",
      "🙌",
      "🤔",
      "🥰",
      "🥳",
      "😊",
      "🙏",
      "👍",
      " 😁",
      "😎",
      "🤗",
      "🎉",
      "🤣",
      "😘",
      "🤩",
      "😭",
      "🥺",
      "🙈",
      "💪",
      "✌️",
      "🤦‍♂️",
      "😇",
      "😋",
      "🤘",
    ];
    if (cnt % 2 === 0) {
      setEmojis(arr);
    } else {
      setEmojis([]);
    }
    setCnt(1 + cnt);
  };

  return (
    <div style={{ backgroundColor: "#fae5aa" }}>
      <div className="message" ref={containerRef}>
        <div className="headings">
          <h1>
            Community Space <UsergroupDeleteOutlined />
          </h1>
        </div>
        {view.map((mess, index) => {
          let prevValue;
          if (index > 0) prevValue = view[index - 1].date;
          return (
            <div key={index} className="internal">
              {index === 0 || mess.date !== prevValue ? (
                <Divider
                  style={{ marginTop: index === 0 ? "75px" : "inherit" }}
                >
                  {mess.date}
                </Divider>
              ) : null}
              <p
                key={index}
                className={mess.email === email ? "a" : "b"}
                onClick={(e) => addToDo(e, mess.message)}
              >
                <small style={{ fontSize: "11px", color: color[mess.email] }}>
                  <strong>{mess.email}</strong>
                </small>
                <br></br>
                {mess.message}{" "}
                <small style={{ fontSize: "9px" }}>{mess.time}</small>
              </p>
            </div>
          );
        })}
      </div>
      <div className="send">
        <TextArea
          placeholder="Message"
          autoSize={{ minRows: 1, maxRows: 6 }}
          className="input"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <SmileOutlined
          style={{ marginTop: "12px", marginLeft: "0px" }}
          onClick={handleEmojiClick}
          className="smily"
        />
        <div style={{ margin: "24px 0" }} />
        <Button
          shape="circle"
          icon={
            <SendOutlined
              style={{ color: "black", backgroundColor: "#41ed1a" }}
              className="icon2"
            />
          }
          size="large"
          className="btn1"
          style={{ backgroundColor: "#41ed1a" }}
          onClick={handleClick}
          ref={buttonRef}
        />
      </div>
      <div
        style={{ display: "flex", marginLeft: "20px", paddingRight: "10px" }}
        className="emoji"
      >
        {emojis.map((emoji, index) => {
          return (
            <div
              key={index}
              style={{ marginLeft: "10px" }}
              onClick={(e) => setMsg(`${msg}${emoji}`)}
            >
              {emoji}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Antdesign;
