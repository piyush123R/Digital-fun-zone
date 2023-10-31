import React from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState } from "react";
import './imgupload.css'
import Button from "react-bootstrap/Button";

const Imageupload = () => {
  const [batters, setBatters] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [strings, setStrings] = useState([]);
  const [bowl,setBowl]=useState([])
  const [details,setDetails]=useState([]);
  const options = {
    method: "GET",
    url: "https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/40381/scard",
    headers: {
      // "X-RapidAPI-Key": "1d595f45b0msh4d0a835be416c39p17c5a6jsnd5ec81109d5f",
      'X-rapidapi-key': '2ad2cbabddmshb43920589f8f038p14acd0jsncee9331fff8a',
      "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
    },
  };

  const handleClick = (e,index) => {
    e.preventDefault();
    axios
      .request(options)
      .then((result) => {
        console.log(result.data.scoreCard[index]);
        const arr=[];
        arr.push(result.data.scoreCard[index].batTeamDetails.batTeamName)
        arr.push(result.data.scoreCard[index].scoreDetails.runs)
        arr.push(result.data.scoreCard[index].scoreDetails.wickets)
        arr.push(result.data.scoreCard[index].scoreDetails.overs)
        arr.push(result.data.matchHeader.status)
        setDetails(arr)
        const batter = result.data.scoreCard[index].batTeamDetails.batsmenData;
        const bowler = result.data.scoreCard[index].bowlTeamDetails.bowlersData;

        setBatters(batter);
        setBowlers(bowler);
        let batterlen = 0;
        let bowlerlen = 0;
        for (let item in batter) {
          if (item.length > 0) batterlen++;
        }
        for (let item in bowler) {
          if (item.length > 0) bowlerlen++;
        }
        console.log(batterlen);
        console.log(bowlerlen);
        var str = [];
        for (let i = 1; i <= batterlen; i++) {
          const s = `bat_${i}`;
          str.push(s.toString());
        }
        setStrings(str);
        str = [];
        for (let i = 1; i <= bowlerlen; i++) {
          const s = `bowl_${i}`;
          str.push(s.toString());
        }
        setBowl(str);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="commands">
      <Button variant='success' onClick={(e)=>handleClick(e,0)} className="bx">1st Inning</Button>
      <Button onClick={(e)=>handleClick(e,1)} className="bx">2nd Inning</Button>
      <Button variant='info' className='bx'>Ireland vs United States </Button>
      </div>
      <h4>{details[4]}</h4>
      <div className="score">
      <h4>{details[0]}</h4>
      <h4 className="runs">{details[1]}-{details[2]}({details[3]} Ov)</h4>
      </div>
      <Table hover className="T1">
        <thead>
          <tr>
            <th>Batter</th>
            <th></th>
            <th>Runs</th>
            <th>Balls</th>
            <th>4s</th>
            <th>6s</th>
            <th>SR</th>
          </tr>
        </thead>
        <tbody>
          {strings.map((item, index) => {
            return (
              <tr key={index}>
               
                {batters[item].isCaptain ? (
                  <td>{batters[item].batName} (c)</td>
                ) : batters[item].isKeeper ? (
                  <td>{batters[item].batName} (wk)</td>
                ) : (
                  <td>{batters[item].batName}</td>
                )}
                <td>{batters[item].outDesc}</td>
                <td>{batters[item].runs}</td>
                <td>{batters[item].balls}</td>
                <td>{batters[item].fours}</td>
                <td>{batters[item].sixes}</td>
                <td>{batters[item].strikeRate}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Table hover className="T2">
        <thead>
          <tr>
           
            <th>Bowler</th>
            <th>Overs</th>
            <th>Maidens</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>NB</th>
            <th>WD</th>
            <th>ECO</th>
          </tr>
        </thead>
        <tbody>
          {bowl.map((item, index) => {
            return (
              <tr key={index}>
                
                {bowlers[item].isCaptain ? (
                  <td>{bowlers[item].bowlName} (c)</td>
                ) : bowlers[item].isKeeper ? (
                  <td>{bowlers[item].bowlName} (wk)</td>
                ) : (
                  <td>{bowlers[item].bowlName}</td>
                )}
                <td>{bowlers[item].overs}</td>
                <td>{bowlers[item].maidens}</td>
                <td>{bowlers[item].runs}</td>
                <td>{bowlers[item].wickets}</td>
                <td>{bowlers[item].no_balls}</td>
                <td>{bowlers[item].wides}</td>
                <td>{bowlers[item].economy}</td>
              </tr>
            );
          })}
        </tbody>
        
      </Table>
    </div>
  );
};

export default Imageupload;
