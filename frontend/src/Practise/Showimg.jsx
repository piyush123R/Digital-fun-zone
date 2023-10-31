import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import foods from "./menu";
import axios from "axios";
import {useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Showimg = () => {
  const menus = foods;
  const myStyle = {
    marginLeft: "15px",
    marginTop: "15px",
    width: "18rem",
  };

  const [price, setPrice] = useState({});
  const [accuracy, setAccuracy] = useState({});
  const [predictions, setPredictions] = useState({});
  const [score,setScore]=useState(0)
  const [count,setCount]=useState(0)
  const [stocks,setStocks]=useState([foods])
  const [Id,setId]=useState(6)
  const email=useSelector(state=>state.user.email)
  const navigate=useNavigate();

  const handleClick = (e, company) => {
    e.preventDefault();
    var prediction = prompt(`Your predicted price for ${company} stocks`);
    const val = parseFloat(prediction);
    const apiKey = "FSI0G1FB9HJDUS6S";
    // const apiKey="11BMH8MRV2U939V8";
    const symbol = company;
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${apiKey}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const stockData = response.data;
        console.log(stockData);
        const currentPrice = stockData["Global Quote"]["05. price"];
        
        setPrice((prevPrice) => ({
          ...prevPrice,
          [company]: currentPrice,
        }));
        localStorage.setItem(company, currentPrice);
        console.log(`Current price of the ${symbol}: ${currentPrice}`);
        const currprice = Math.abs(currentPrice - val);
        const per = (currprice * 100) / currentPrice;
        const storedPrediction = prediction;
        const newScore=score+((100-per))/100;
        setScore(parseFloat(newScore.toFixed(4)))
        prediction = (100 - per).toFixed(3);
        setCount(count+1)
        setAccuracy((prev) => ({
          ...prev,
          [company]: prediction,
        }));
        setPredictions((prev) => ({
          ...prev,
          [company]: storedPrediction,
        }));
        
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  };

  useEffect(()=>{
      axios.get('http://localhost:3001/getscore',{params:{email,score,count}})
        .then((result)=>{
          if(result.data.length>0)
          {setCount(result.data[0].count)
          setScore(result.data[0].score)}
          console.log("Hello home")
        })
        .catch((err)=>console.log(err))
  },[score,email,count])
  
  const addItems=((e)=>{
    e.preventDefault()
    const companyList=["HDFCBANK","INFY","ICICIBANK","HINDUNILVR","KOTAKBANK","SBIN",
                       "LT","MARUTI","AXISBANK","M&M","BAJFINANCE","HCLTECH","WIPRO","ASIANPAINT",
                       "BHARTIARTL","SUNPHARMA","ULTRACEMCO","BAJAJ-AUTO","TITAN","ONGC","ADANIPORTS",
                       "POWERGRID","TECHM","ULTRACEMCO","DRREDDY","COALINDIA","INDUSINDBK","HINDALCO",
                      "CIPLA","ADANIGREEN"];
    
    const img=['/images/stocks.jfif','/images/bgmoney.jfif','/images/stock.jfid.jfif','/images/stocksnew.jfif']

    const index1=Math.floor(Math.random()*companyList.length)
    const index2=Math.floor(Math.random()*img.length)
    const obj={
      id:Id,
      images:img[index2],
      company: companyList[index1]
    }
    setId(Id+1);
   
    foods.push(obj);
    setStocks(prevItemList =>({
       ...prevItemList,
       [stocks]:foods
    }));
   
  })

  const view = (e) => {
    e.preventDefault();
    for (let item of foods) {
      const val = localStorage.getItem(item.company);
      if (val) {
        setPrice((prevPrice) => ({
          ...prevPrice,
          [item.company]: val,
        }));
      }
    }
  };

  return (
    <div>
      
      <Button variant="primary" className="mx-3 mt-3" onClick={view}>
        View older prices
      </Button> 
      <Button variant="info" className="mx-3 mt-3" onClick={addItems}>
        New stocks
      </Button>
      {score<=0?(<Button variant="danger" className="mx-3 mt-3" >
        <strong style={{color:'white' , fontWeight: 'bold'}}>"{email}"</strong> current score is : {score}
      </Button>):(<Button variant="success" className="mx-3 mt-3" >
      <strong style={{color:'white'}}>"{email}"</strong> current score is : {score}
      </Button>)}

      <Button variant="dark" className="mx-3 mt-3">
        Prediction count is : {count}
      </Button>
      
      <Button variant="info"  className="mx-3 mt-3" onClick={(e)=>{e.preventDefault();navigate('/ranking')}}>View Leaderboard</Button>
      
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {menus.map((menu, index) => {
          return (
            <div key={index} style={{ flex: "0 0 25%" }}>
              <Card style={myStyle}>
                <Card.Img variant="top" src={menu.images} style={{  height: '200px' }}/>
                <Card.Body>
                  <Button
                    variant="primary"
                    className="mb-2"
                    onClick={(e) => handleClick(e, menu.company)}
                  >
                    Update
                  </Button>
                  <Card.Title>{menu.company}</Card.Title>
                  <Card.Text>
                    Stock price: <strong>{price[menu.company]}</strong>
                    
                  </Card.Text>
                  <p>Predicted price: {predictions[menu.company]}</p>
                  <Card.Text>
                    Prediction Accuracy:{" "} 
                     {accuracy[menu.company] > 50.0 ? ( 
                         <strong style={{ color: "green" }}>
                          {accuracy[menu.company]}
                      </strong>
                    ) : (
                      <strong style={{ color: "red" }}>
                        {accuracy[menu.company]}
                      </strong>
                    )}{" "}
                    %
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Showimg;
