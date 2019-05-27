import React from 'react';
import Board from './Board';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winnerRow: lines[i]};
    }
  }

  return {winner: null, winnerRow: null};
};

const getLocation = (move) => {
  const locationMap = {
    0: 'row: 1, col: 1',
    1: 'row: 1, col: 2',
    2: 'row: 1, col: 3',
    3: 'row: 2, col: 1',
    4: 'row: 2, col: 2',
    5: 'row: 2, col: 3',
    6: 'row: 3, col: 1',
    7: 'row: 3, col: 2',
    8: 'row: 3, col: 3',
  };

  return locationMap[move];
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      currentStepNumber: 0,
      xIsNext: true,
      winHistory: {"X": 0, "O": 0}
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      currentStepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  startGame() {
    this.setState({started: true});
  }

  newGame() {
    const {history} = this.state;
    const current = history[this.state.currentStepNumber];
    const {winner} = calculateWinner(current.squares);
    debugger;
    let {winHistory} = this.state;
    let newWinCount = this.state.winHistory[winner] + 1;
    winHistory[winner] = newWinCount;

    this.setState({
      winHistory,
      started: true,
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      currentStepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const {history} = this.state;
    const current = history[this.state.currentStepNumber];
    const {winner, winnerRow} = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const currentLocation = step.currentLocation ? `(${step.currentLocation})` : '';
      const desc = step.stepNumber ? `Go to move #${step.stepNumber}` : 'Go to game start';
      const classButton = move === this.state.currentStepNumber ? 'button--green' : '';

      return (
          <li key={step.stepNumber}>
            <button className={`${classButton} button`} onClick={() => this.jumpTo(move)}>
              {`${desc} ${currentLocation}`}
            </button>
          </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner ${winner}`;
    } else if (history.length === 10) {
      status = 'Draw. No one won.';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    const {started} = this.state;

    return (
        <div>
          <h1>Tic Tac Toe</h1>

          {started ? (
                  <div className="game">
                    <div className="game-board">
                      <Board
                          squares={current.squares}
                          winnerSquares={winnerRow}
                          onClick={i => this.handleClick(i)}
                      />
                    </div>
                    <div className="game-info">
                      <div>{status}</div>
                      <table>
                        <tr>
                          <th>Player</th>
                          <th>Number Wins</th>
                        </tr>
                        {Object.keys(this.state.winHistory).map(key => {
                          return (
                              <tr>
                                <td>{key}</td>
                                <td>{this.state.winHistory[key]}</td>
                              </tr>
                          )
                        })}
                      </table>
                    </div>
                    {winnerRow && (<button onClick={i => this.newGame(i)}>New Game</button>)}
                  </div>

              ) :

              (<button onClick={i => this.startGame(i)}>Start Game</button>)
          }
        </div>
    );
  }
}

export default Game;
