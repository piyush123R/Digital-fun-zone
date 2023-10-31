import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Divider, Alert, Card } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { Table } from "antd";

const socket = io.connect("http://localhost:3002");
const { TextArea } = Input;
const id = nanoid(4);
const { Meta } = Card;
const Multipurpose = () => {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [cnt, setCnt] = useState(0);
  const [king, setKing] = useState(0);
  const [permutaions, setPermutaions] = useState([]);
  const [roundCnt, setRoundCnt] = useState(0);
  const [prediction, setPrediction] = useState({});
  const [soldier, setSoldier] = useState(-1);
  const [suffle, setSuffle] = useState(false);
  const [predictCount, setPredictCount] = useState(0);
  const [success, setSuccess] = useState();
  const [currScore, setCurrScore] = useState([0, 0, 0, 0]);
  const [images, setImages] = useState();
  const [playerData, setPlayerData] = useState([]);
  const [playerColumns, setPlayerColumns] = useState([]);
  const buttonRef = useRef(null);
  const handleClick = (e) => {
    e.preventDefault();
    const ind = Math.floor(Math.random() * 4);
    socket.emit("chat", { name: msg, userName: id, ind });
    setCnt(1 + cnt);
    setMsg("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current.click();
    }
  };
  function dfs(i, a) {
    if (i === a.length) {
      const val = [...a];
      setPermutaions((prev) => [...prev, val]);
      return;
    }
    for (var j = i; j < a.length; j++) {
      let x = a[i];
      let y = a[j];
      [x, y] = [y, x];
      a[i] = x;
      a[j] = y;
      dfs(i + 1, a);
      x = a[i];
      y = a[j];
      [x, y] = [y, x];
      a[i] = x;
      a[j] = y;
    }
  }
  const startGame = (e) => {
    const ind = Math.floor(Math.random() * permutaions.length);
    const arr = permutaions[ind];
    console.log(arr);
    let value = 0;
    socket.emit("buttonStatus", { disabled: true });
    socket.emit("predictionCount", { count: value });
    const heading = `Round : ${roundCnt}`;
    let Minister, Theif, Soldier;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 1000) {
        socket.emit("king", { index: i });
        const newMsg = `${chat[i].name}`;
        socket.emit("result", {
          message: newMsg,
          userName: chat[i].userName,
          heading,
          type: "king",
        });
      } else if (arr[i] === 500) {
        const newMsg = `${chat[i].name} `;
        Soldier = i;
        socket.emit("result", {
          message: newMsg,
          userName: chat[i].userName,
          heading,
          type: "Soldier",
        });
      } else {
        if (arr[i] === 800) Minister = i;
        else Theif = i;
      }
    }
    socket.emit("remaining", { Minister, Theif, Soldier });
  };
  useEffect(() => {
    const img = [
      "/images/games.jfif",
      "/images/user.png",
      "/images/newGame.jfif",
      "/images/gamerz.jfif",
    ];
    setImages(img);
    socket.on("chat", (payload) => {
      setChat((prev) => [...prev, payload]);
    });

    socket.on("king", (payload) => {
      setKing(payload.index);
      console.log(`King is ${payload.index}`);
    });

    socket.on("round", (payload) => {
      setRoundCnt(1 + payload.round);
    });

    socket.on("remaining", (payload) => {
      setPrediction(payload);
      setSoldier(payload.Soldier);
    });

    socket.on("buttonStatus", (payload) => {
      setSuffle(payload.disabled);
    });

    socket.on("prediction", (payload) => {
      setSuccess(payload.predict);
    });

    socket.on("predictionCount", (payload) => {
      setPredictCount(payload.count);
    });

    socket.on("score", (payload) => {
      let arr = payload.score;
      setCurrScore(arr);
    });

    socket.on("tableHeading", (payload) => {
      setPlayerColumns(payload.column);
    });
    socket.on("player", (payload) => {
      setPlayerData((prev) => [payload.obj, ...prev]);
    });
    const nums = [1000, 800, 500, 0];
    dfs(0, nums);
  }, []);
  useEffect(() => {
    if (chat.length === 4) {
      const index = 0;
      console.log(`Inital index of king is ${index}`);
      setKing(index);
    }
  }, [chat]);
  useEffect(() => {
    if (chat.length === 4) {
      console.log("Useeffect hook runs");
      const playerName = [];
      playerName.push("Round#");
      chat.forEach((item, index) => {
        playerName.push(item.name);
      });
      const playerColumns = playerName.map((name, index) => ({
        title: name,
        dataIndex: name,
        key: index,
      }));
      socket.emit("tableHeading", { column: playerColumns });
    }
  }, [chat]);

  const findTheif = (e, val) => {
    e.preventDefault();
    let arr = [1, 2, 3, 4];
    let value = 1;
    if (val === 1) {
      socket.emit("prediction", { predict: true });
      arr[king] = 1000;
      arr[prediction.Minister] = 800;
      arr[soldier] = 500;
      arr[prediction.Theif] = 0;
      socket.emit("score", { score: arr });
    } else {
      socket.emit("prediction", { predict: false });
      arr[king] = 1000;
      arr[prediction.Minister] = 800;
      arr[soldier] = 0;
      arr[prediction.Theif] = 500;
      socket.emit("score", { score: arr });
    }

    const obj = {
      key: roundCnt,
      [playerColumns[0].title]: `R${roundCnt + 1}`,
      [playerColumns[1].title]: arr[0],
      [playerColumns[2].title]: arr[1],
      [playerColumns[3].title]: arr[2],
      [playerColumns[4].title]: arr[3],
    };
    socket.emit("player", { obj });

    console.log(playerColumns);
    console.log(arr);
    console.log(obj);
    socket.emit("round", { round: roundCnt });
    socket.emit("predictionCount", { count: value });
    socket.emit("buttonStatus", { disabled: false });
  };
  const calculateSum = (columnName) => {
    const sum = playerData.reduce((total, row) => total + row[columnName], 0);
    return sum;
  };
  return (
    <div>
      {cnt === 0 ? (
        <div>
          <TextArea
            placeholder="Enter you name "
            autoSize
            style={{ width: "60%", margin: "15px" }}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="primary"
            style={{ margin: "15px" }}
            onClick={handleClick}
            ref={buttonRef}
          >
            Sent
          </Button>
        </div>
      ) : null}
      {chat.length === 4
        ? Object.entries(prediction).map(([key, value]) => {
            return (
              <div key={key} style={{ margin: "15px" }}>
                {id === chat[value].userName ? <h3>You are {key}</h3> : null}
              </div>
            );
          })
        : null}
      {chat.length === 4 &&
      soldier !== -1 &&
      chat[soldier].userName === id &&
      predictCount === 0 ? (
        <div style={{ margin: "15px", display: "flex" }}>
          <p>
            <strong>Soldier</strong> predict{" "}
            <strong style={{ color: "red" }}>theif</strong>
          </p>
          {Math.random() > 0.5 ? (
            <div>
              <Button
                type="primary"
                style={{ marginLeft: "15px" }}
                onClick={(e) => {
                  findTheif(e, 0);
                }}
              >
                {chat[prediction.Minister].name}
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "15px" }}
                onClick={(e) => {
                  findTheif(e, 1);
                }}
              >
                {chat[prediction.Theif].name}
              </Button>
            </div>
          ) : (
            <div>
              <Button
                type="primary"
                style={{ marginLeft: "15px" }}
                onClick={(e) => {
                  findTheif(e, 1);
                }}
              >
                {chat[prediction.Theif].name}
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "15px" }}
                onClick={(e) => {
                  findTheif(e, 0);
                }}
              >
                {chat[prediction.Minister].name}
              </Button>
            </div>
          )}
        </div>
      ) : null}
      {predictCount === 1 ? (
        success === true ? (
          <Alert
            message="Correct prediction from soldier"
            type="success"
            showIcon
            style={{ margin: "15px", width: "30%" }}
          />
        ) : success === false ? (
          <Alert
            message="Wrong Prediction from soldier"
            type="error"
            showIcon
            style={{ margin: "15px", width: "30%" }}
          />
        ) : null
      ) : null}
      {chat.length === 4 && chat[king].userName === id ? (
        <div>
          <Button
            type="primary"
            style={{ margin: "15px" }}
            onClick={startGame}
            ref={buttonRef}
            disabled={suffle}
          >
            <CrownOutlined /> suffle now
          </Button>
        </div>
      ) : null}
      {chat.length === 4 ? <Divider>Players</Divider> : null}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {chat.map((payload, index) => {
          return (
            <div key={index} style={{ flex: "0 0 25%" }}>
              <Card
                hoverable
                style={{
                  margin: "15px",
                  height: "260px",
                }}
                cover={
                  <img
                    alt="example"
                    src={images[payload.ind]}
                    style={{ height: "130px" }}
                  />
                }
              >
                <Meta
                  title={`Name: ${payload.name}`}
                  description={`Player ${index + 1} `}
                />
                <br></br>
                {roundCnt > 0 ? (
                  <p>
                    <strong>R{roundCnt}</strong> score :{" "}
                    <strong>{currScore[index]}</strong>
                  </p>
                ) : null}
              </Card>
            </div>
          );
        })}
      </div>
      {roundCnt > 0 ? <Divider>Round wise result</Divider> : null}
      {chat.length === 4 && roundCnt > 0 ? (
        <div>
          <div
            style={{
              marginBottom: "10px",
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="primary"
              style={{
                marginLeft: "15px",
                marginTop: "10px",
                marginRight: "10px",
                backgroundColor: "#f5492f",
              }}
            >
              <strong>{chat[0].name} </strong> Total Score:{" "}
              <strong> {calculateSum(chat[0].name)}</strong>
            </Button>
            <Button
              type="primary"
              style={{
                marginLeft: "15px",
                marginTop: "10px",
                marginRight: "10px",
                backgroundColor: "#f59802",
              }}
            >
              <strong>{chat[1].name} </strong> Total Score:{" "}
              <strong> {calculateSum(chat[1].name)}</strong>
            </Button>
            <Button
              type="primary"
              style={{
                marginLeft: "15px",
                marginTop: "10px",
                marginRight: "10px",
                backgroundColor: "#3bf56c",
              }}
            >
              <strong>{chat[2].name} </strong> Total Score:
              <strong> {calculateSum(chat[2].name)}</strong>
            </Button>
            <Button
              type="primary"
              style={{
                marginLeft: "15px",
                marginTop: "10px",
                marginRight: "25px",
                backgroundColor: "#11a7f2",
              }}
            >
              <strong>{chat[3].name} </strong> Total Score:{" "}
              <strong> {calculateSum(chat[3].name)}</strong>
            </Button>
          </div>
          <Table
            columns={playerColumns}
            dataSource={playerData}
            pagination={false}
            scroll={{ y: "calc(100vh - 200px)" }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Multipurpose;
