import React, { useState, useEffect } from "react";
import "./App.css";

const Col: number = Math.floor(window.innerWidth / 10) - 1;
const Row: number = Math.floor(window.innerHeight / 10) - 2;
const windowWidth: number = window.innerWidth - (window.innerWidth % 10) - 10;

const genArray = (): Array<Array<number>> => {
  const genRow = (): Array<number> =>
    Array(Col)
      .fill(0)
      .map(x => (Math.random() < 0.2 ? 1 : 0));
  return Array(Row)
    .fill(0)
    .map(genRow);
};

const calcNextState = (
  currState: Array<Array<number>>
): Array<Array<number>> => {
  let newState: Array<Array<number>> = [];
  for (let i = 0; i < currState.length; i++) {
    newState.push(Array(Col).fill(0));
    for (let j = 0; j < currState[i].length; j++) {
      const liveNeighbours = getNeighbours(currState, i, j);
      if (currState[i][j] && liveNeighbours < 2) newState[i][j] = 0;
      if (currState[i][j] && liveNeighbours <= 3 && liveNeighbours >= 2)
        newState[i][j] = 1;
      if (currState[i][j] && liveNeighbours > 3) newState[i][j] = 0;
      if (!currState[i][j] && liveNeighbours === 3) newState[i][j] = 1;
    }
  }
  return newState;
  function getNeighbours(
    arr: Array<Array<number>>,
    x: number,
    y: number
  ): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        count += arr[(Row + i + x) % Row][(Col + j + y) % Col];
      }
    }
    return count - arr[x][y];
  }
};

function App(): React.FunctionComponentElement<{}> {
  const [nodes, setNodes] = useState(genArray);
  const drawNodes = () => {
    return nodes.map((row, x) =>
      row.map((cell, y) => {
        return (
          <div className={cell ? "cell live" : "cell dead"} key={x + y}></div>
        );
      })
    );
  };
  useEffect(() => {
    const loop = setInterval(() => {
      setNodes(calcNextState);
    }, 100);

    return () => {
      clearInterval(loop);
    };
  }, []);
  return (
    <div className="App" style={{ width: windowWidth + "px" }}>
      <p
        style={{
          color: "#999999",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "64px",
          margin: 0,
          fontWeight: 700,
          zIndex: -1,
          letterSpacing: 5
        }}
      >
        Game of Life
      </p>
      {drawNodes()}
    </div>
  );
}

export default App;
