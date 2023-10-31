import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Divider } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { WechatOutlined,SmileOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./antidesign.css";
import axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

const Personalchat = () => {
  const [view, setView] = useState([]);
  const [msg, setMsg] = useState("");
  const [pair, setPair] = useState("");
  const [emojis, setEmojis] = useState([]);
  const [cnt, setCnt] = useState(0);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const email = useSelector((state) => state.user.email);
  const location = useLocation();
  const recEmail = location.state?.newEmail;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current.click();
    }
  };
  const max = (str1, str2) => {
    if (str1.localeCompare(str2) > 0) return str1;
    else return str2;
  };
  const min = (str1, str2) => {
    if (str1.localeCompare(str2) > 0) return str2;
    else return str1;
  };
  useEffect(() => {
    const str1 = recEmail;
    const str2 = email;
    setPair(`${max(str1, str2)}-${min(str1, str2)}`);
    if (email === null) {
      alert("Login first to view the messages");
      return;
    }
    axios
      .get("http://localhost:3001/getchat", { params: { pair } })
      .then((result) => {
        const arr = result.data;
        setView(arr);
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 0);
      })
      .catch((err) => console.log(err));
    console.log(pair);
  }, [email, recEmail, pair]);
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
        .get("http://localhost:3001/getchat", { params: { pair } })
        .then((result) => {
          const arr = result.data;

          setView(arr);
        })
        .catch((err) => console.log(err));
    }, 30000);
  }, [view, email, recEmail, pair]);

  const handleClick = (e) => {
    e.preventDefault();
    setMsg("");
    if (email === null) {
      alert("Login first to use this ");
      return;
    }
    const time = new Date();
    const date = time.toLocaleDateString();
    const val = `${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    // const str1 = recEmail;
    // const str2 = email;
    // const pair = `${max(str1, str2)}-${min(str1, str2)}`;
    console.log(pair);

    if (msg.length > 0) {
      axios
        .post("http://localhost:3001/savechat", { email, pair, msg, val, date })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    }

    axios
      .get("http://localhost:3001/getchat", { params: { pair } })
      .then((result) => {
        const arr = result.data;
        setView(arr);
      })
      .catch((err) => console.log(err));
      setEmojis([]);
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
      "🤘"
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
            {recEmail} <WechatOutlined />
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
                className={mess.email === email ? "a" : "b"}
                onClick={(e) => addToDo(e, mess.message)}
              >
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
          onClick={(e) => handleClick(e)}
          ref={buttonRef}
        />
      </div>
      <div style={{ display: "flex", marginLeft: "20px", paddingRight:"10px"}} className="emoji">
        {emojis.map((emoji, index) => {
          return (
            <div
              key={index}
              style={{ marginLeft: "10px"}}
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

export default Personalchat;
