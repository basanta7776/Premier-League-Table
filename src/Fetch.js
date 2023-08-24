import React, { useState, useEffect } from "react";
import image from "./Image";
import axios from "axios";

const url =
  "https://raw.githubusercontent.com/openfootball/football.json/master/2020-21/en.1.json";

const Fetch = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // try {
      const response = await axios.get(url);
      const data = response.data;
      // console.log(data);
      const filterData = data.matches.filter((match) => {
        return match.score;
      });
      setMatches(filterData);
      // console.log(matches);
    };
    fetchData();
  }, []);

  const dataAcq = {};
  console.log(dataAcq);

  matches.forEach(
    (ftScore) => {
      const { team1, team2, score } = ftScore;
      const fullTime1 = score.ft[0];
      const fullTime2 = score.ft[1];

      // console.log(fullTime1);

      if (!dataAcq[team1]) {
        dataAcq[team1] = {
          games: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsScored: 0,
          goalsConceded: 0,
          goalsDifference: 0,
          points: 0,
          form: [],
        };
      }
      if (!dataAcq[team2]) {
        dataAcq[team2] = {
          games: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsScored: 0,
          goalsConceded: 0,
          goalsDifference: 0,
          points: 0,
          form: [],
        };
      }
      // console.log(dataAcq[team2].games);

      if (fullTime1 > fullTime2) {
        dataAcq[team1].won++;
        dataAcq[team2].lost++;
        dataAcq[team1].points += 3;
        dataAcq[team1].form.unshift("W");
        dataAcq[team2].form.unshift("L");
      } else if (fullTime2 > fullTime1) {
        dataAcq[team2].won++;
        dataAcq[team1].lost++;
        dataAcq[team2].points += 3;
        dataAcq[team2].form.unshift("W");
        dataAcq[team1].form.unshift("L");
      } else {
        dataAcq[team1].drawn++;
        dataAcq[team2].drawn++;
        dataAcq[team1].points += 1;
        dataAcq[team2].points += 1;
        dataAcq[team1].form.unshift("D");
        dataAcq[team2].form.unshift("D");
      }

      dataAcq[team1].games++;
      dataAcq[team2].games++;
      console.log(dataAcq[team1].games);
      // console.log(dataAcq[team2].games);

      dataAcq[team1].goalsScored += fullTime1;
      dataAcq[team2].goalsScored += fullTime2;

      dataAcq[team1].goalsConceded += fullTime2;
      dataAcq[team2].goalsConceded += fullTime2;

      dataAcq[team1].goalsDifference =
        dataAcq[team1].goalsScored - dataAcq[team1].goalsConceded;
      dataAcq[team2].goalsDifference =
        dataAcq[team2].goalsScored - dataAcq[team2].goalsConceded;

      dataAcq[team1].form = dataAcq[team1].form.slice(0, 5);
      dataAcq[team2].form = dataAcq[team2].form.slice(0, 5);
    }
    // setdataAcq(dataAcq);
    // console.log(dataAcq);
  );

  // fetchData();

  return (
    <>
      <div className="div">
        <img
          className="plLogo"
          src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png"
          alt="PL logo"
        />{" "}
        <h1>Points Table</h1>
      </div>
      <table className="table">
        <thead className="table-head">
          <tr>
            <th className="Position">Position</th>
            <th className="Club">Club</th>
            <th className="Played">Played</th>
            <th className="Won">Won</th>
            <th className="Draw">Draw</th>
            <th className="Lost">Lost</th>
            <th className="GF">GF</th>
            <th className="GA">GA</th>
            <th className="GD">GD</th>
            <th className="Points">Points</th>
            <th className="Form">Form</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(dataAcq)
            .sort((teamA, teamB) => {
              if (dataAcq[teamB].points !== dataAcq[teamA].points) {
                return dataAcq[teamB]?.points - dataAcq[teamA]?.points;
              } else if (dataAcq[teamB]?.points === dataAcq[teamA]?.points) {
                return (
                  dataAcq[teamB]?.goalsDifference -
                  dataAcq[teamA]?.goalsDifference
                );
              } else {
                return (
                  dataAcq[teamB]?.goalsScored - dataAcq[teamA]?.goalsScored
                );
              }
            })
            .map((team, index) => {
              const clubLogos = image.filter(
                (logoos) => logoos.name === team
              )[0]?.logo;

              return (
                <tr key={team}>
                  <td className="Index">{index + 1}</td>
                  <td className="Team">
                    <img
                      src={clubLogos}
                      alt="Club Logos"
                      width={20}
                      height={20}
                    />
                    {team}
                  </td>
                  <td className="Play">{dataAcq[team].games}</td>
                  <td className="Won">{dataAcq[team].won}</td>
                  <td className="Draw">{dataAcq[team].drawn}</td>
                  <td className="Lost">{dataAcq[team].lost}</td>
                  <td className="GF">{dataAcq[team].goalsScored}</td>
                  <td className="GA">{dataAcq[team].goalsConceded}</td>
                  <td className="GD">{dataAcq[team].goalsDifference}</td>
                  <td className="Points">{dataAcq[team].points}</td>
                  <td className="Form">
                    {dataAcq[team].form.map((result, index) => (
                      <span
                        key={index}
                        className={`FormResult ${
                          result === "W"
                            ? "Green"
                            : result === "L"
                            ? "Red"
                            : "Gray"
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default Fetch;
