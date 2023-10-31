import React, { useEffect, useState, useRef } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import axios from "axios";
import { Input, Button } from "antd";
import "./Game.css";
const Game = () => {
  const [word, setWord] = useState("");
  const [letterArray, setletterArray] = useState([]);
  const [wordArray, setwordArray] = useState([]);
  const [status, setStatus] = useState("");
  const [cnt, setCnt] = useState(0);
  const [score, setScore] = useState(-1);
  const [letter, setLetter] = useState("");
  const [newPage, setNewPage] = useState(0);
  const [result, setResult] = useState(
    "🎊 Congratulations you won 🎉🎈 with score"
  );
  const [actualScore, setActualScore] = useState(0);
  const [level, setLevel] = useState(1);
  const buttonRef = useRef();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonRef.current.click();
    }
  };
  const pickLetter = (e) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const char = alphabet[Math.floor(Math.random() * 26)];
    setCnt(1 + cnt);
    setLetter(char);
    setletterArray((prev) => [...prev, char]);
  };
  const calculateActualScore = (s) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const index1 = alphabet.indexOf(s[0]);
    const index2 = alphabet.indexOf(letter);
    const tempScore = Math.abs(index1 - index2);
    const val = score + 26 - tempScore;
    if (val >= 250) setResult("🎊 Congratulations you won 🎉🎈 with score");
    setActualScore(actualScore + 26 - tempScore);
  };
  const calculateScore = (s) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const index1 = alphabet.indexOf(s[0]);
    const index2 = alphabet.indexOf(letter);
    const tempScore = Math.abs(index1 - index2);
    const val = score + 26 - tempScore;
    if (val >= 250) setResult("🎊 Congratulations you won 🎉🎈 with score");
    setScore(score + 26 - tempScore);
    setActualScore(actualScore + 26 - tempScore);
  };
  const handleClick = (e) => {
    console.log(wordArray);
    if (wordArray.includes(word)) {
      alert("You have used this word");
      setWord("");
      return;
    }
    if (word === null || word.length === 0) {
      alert("Input field must not be empty");
      return;
    }
    if (level === 1) {
      if (cnt > 14) {
        const msg = `You lose! 😞😥`;
        setResult(msg);
        setScore(1001);
        calculateActualScore(word);
        return;
      }
    } else if (level === 2) {
      if (cnt > 13) {
        const msg = `You lose! 😞😥`;
        setResult(msg);
        setScore(1001);
        calculateActualScore(word);
        return;
      }
    } else if (level === 3) {
      if (cnt > 12) {
        const msg = `You lose! 😞😥`;
        setResult(msg);
        setScore(1001);
        calculateActualScore(word);
        return;
      }
    } else if (level === 4) {
      if (cnt > 11) {
        const msg = `You lose! 😞😥`;
        setResult(msg);
        setScore(1001);
        calculateActualScore(word);
        return;
      }
    }
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    axios
      .get(url)
      .then((result) => {
        const newWord = word.toLowerCase();
        setStatus("success");
        calculateScore(newWord);
        console.log(result);
      })
      .catch((err) => {
        setStatus("failed");
        setScore(score - 27);
        setActualScore(actualScore - 27);
      });
    pickLetter();
    const newWord = word.toLowerCase();
    setwordArray((prev) => [...prev, newWord]);
    setWord("");
  };
  useEffect(() => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const char = alphabet[Math.floor(Math.random() * 26)];
    setCnt(1 + cnt);
    setLetter(char);
    setletterArray((prev) => [...prev, char]);
  }, [newPage]);

  const resetGame = (e) => {
    e.preventDefault();
    setScore(-1);
    setActualScore(0);
    setCnt(0);
    setStatus("");
    setWord("");
    setLetter("");
    setletterArray([]);
    setwordArray([]);
    setNewPage(1 + newPage);
  };
  const selectLevel = (e, lev) => {
    e.preventDefault();
    setScore(0);
    setActualScore(0);
    setCnt(0);
    setWord("");
    setStatus("");
    setLetter("");
    setletterArray([]);
    setwordArray([]);
    setNewPage(1 + newPage);
    setLevel(lev);
  };
  return (
    <div>
      {score < 250 && score !== -1 ? (
        <div style={{ margin: "15px" }}>
          <div style={{ display: "flex" }}>
            <h1 style={{ marginBottom: "15px" }}>Prediction #{cnt} is made</h1>
            {score > 0 ? (
              <Button
                type="primary"
                style={{
                  marginTop: "15px",
                  marginLeft: "30px",
                  backgroundColor: "#41f00c",
                }}
              >
                Your score : {score}
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                style={{ marginTop: "15px", marginLeft: "30px" }}
              >
                Your score : {score}
              </Button>
            )}
          </div>
          <Input
            style={{ marginBottom: "15px", marginRight: "15px", width: "50%" }}
            placeholder="Search for a word"
            onChange={(e) => {
              setWord(e.target.value);
            }}
            value={word}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="primary"
            onClick={handleClick}
            style={{ marginBottom: "15px" }}
            ref={buttonRef}
          >
            Search
          </Button>
          {status === "success" ? (
            <p style={{ marginTop: "15px", color: "#0ce851" }}>
              Word <strong>{wordArray[wordArray.length - 1]}</strong> found
            </p>
          ) : status === "failed" ? (
            <p style={{ marginTop: "15px", color: "#ff1f40" }}>
              Word <strong>{wordArray[wordArray.length - 1]}</strong> not found
            </p>
          ) : null}
          {letterArray.length > 1 ? (
            <p
              style={{
                marginBottom: "15px",
                fontWeight: "bold",
                fontSize: "1.5625rem",
              }}
            >
              Prediction #{cnt - 1} is{" "}
              <strong style={{ color: "#176ed1" }}>
                {letterArray[letterArray.length - 2]}
              </strong>
            </p>
          ) : null}
        </div>
      ) : score === -1 ? (
        <div className="homePage">
          <img className="gameImage" src="/images/gamerz.jfif" alt="" />
          <div style={{ margin: "15px" }} className="levels">
            <Button
              type="primary"
              style={{
                margin: "15px",
                backgroundColor: "#41f00c",
                color: "black",
              }}
              onClick={(e) => {
                selectLevel(e, 1);
              }}
            >
              Level 1
            </Button>
            <Button
              type="primary"
              style={{
                margin: "15px",
                backgroundColor: "#f5e60c",
                color: "black",
              }}
              onClick={(e) => {
                selectLevel(e, 2);
              }}
            >
              Level 2
            </Button>
            <Button
              type="primary"
              danger
              style={{ margin: "15px", color: "black" }}
              onClick={(e) => {
                selectLevel(e, 3);
              }}
            >
              Level 3
            </Button>
            <Button
              type="primary"
              style={{
                margin: "15px",
                backgroundColor: "#d61204",
                color: "black",
              }}
              onClick={(e) => {
                selectLevel(e, 4);
              }}
            >
              Level 4
            </Button>
          </div>
        </div>
      ) : (
        <div className="gameOver">
          <h1>
            {result}{" "}
            {actualScore >= 250 ? (
              <em style={{ color: "#1b6e02" }}>{actualScore}</em>
            ) : (
              <em style={{ color: "#f22c1b" }}>{actualScore}</em>
            )}
          </h1>
          <Button
            icon={<CaretRightOutlined />}
            className="playbtn"
            type="primary"
            onClick={resetGame}
          >
            Play again
          </Button>
        </div>
      )}
    </div>
  );
};

export default Game;
