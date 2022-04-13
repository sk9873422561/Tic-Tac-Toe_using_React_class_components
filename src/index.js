import ReactDOM from "react-dom";
import React from "react";
import './index.css';

function getGameStatus(latestSquare){
    let winComb = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for(let i=0;i<winComb.length;i++){
        let s1 = winComb[i][0];
        let s2 = winComb[i][1];
        let s3 = winComb[i][2];

        if(latestSquare[s1]!=null && latestSquare[s1]==latestSquare[s2] && latestSquare[s2]==latestSquare[s3]){
            return 'wins';
        }
    }
    return null;
}


class Board extends React.Component{

    handleBoxClick(i){
        this.props.handlerForBoxClick(i);
    }

    renderSquare(i){
        return(
            <button onClick={()=>this.handleBoxClick(i)}>{this.props.boxes[i]==null?"":this.props.boxes[i]}</button>
        )
    }

    render(){
        return(
            <div className="board">
                <div className="title">Tic Tac Toe</div>
                <div className="content">
                    <div className="ttt">
                        <div className="row">
                            {this.renderSquare(0)}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}
                        </div>

                        <div className="row">
                            {this.renderSquare(3)}
                            {this.renderSquare(4)}
                            {this.renderSquare(5)}
                        </div>

                        <div className="row">
                            {this.renderSquare(6)}
                            {this.renderSquare(7)}
                            {this.renderSquare(8)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Display extends React.Component{

    moveHistory(i){
        this.props.handlerForHistory(i);
    }

    render(){

        let gameTitle = this.props.gameStatus;
        if(gameTitle==null){
            gameTitle = this.props.stepNumber%2==0?'Next move for "X"':'Next move for "O"';
        }


        let buttons = [];

        for(let i=0;i<=this.props.stepNumber;i++){

            let button = (<button onClick={()=>this.moveHistory(i)}>{i==0?'Go to Start':`Go to Step #${i}`}</button>);

            buttons.push(button);
        }

        return(
            <div className="display">
                <div className="title">
                    {gameTitle}
                </div>
                <div className="content">
                    <div className="history">
                        {buttons}
                    </div>
                </div>
            </div>
        )
    }
}

class TTT extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            history: [
                [null,null,null,null,null,null,null,null,null],
            ],
            stepNumber: 0,
            gameStatus: null
        }
    }

    handleSquareClick(i){
        let oldHistory = this.state.history.slice();
        let lastStateOfSquares = oldHistory[oldHistory.length-1].slice();

        if(lastStateOfSquares[i]!=null || (this.state.gameStatus != null)){
            return;
        }

        lastStateOfSquares[i] = this.state.stepNumber%2==0?'X':'O';

        oldHistory.push(lastStateOfSquares);

        let gameStatus = getGameStatus(lastStateOfSquares)=='wins'?`${lastStateOfSquares[i]}`+' wins': null;

        if(this.state.stepNumber==8 && gameStatus == null){
            gameStatus = 'Match Draw';
        }

        this.setState({
            history: oldHistory,
            stepNumber: this.state.stepNumber+1,
            gameStatus: gameStatus
        })
    }

    moveToStep(i){
        let oldHistory = this.state.history.slice(0,i+1);
        
        this.setState({
            history: oldHistory,
            stepNumber: i,
            gameStatus: null
        })
    }

    render(){
        let squares = this.state.history[this.state.history.length-1];
        return(
            <>
            <Board handlerForBoxClick = {(i)=>this.handleSquareClick(i)} boxes = {squares}/>

            <Display stepNumber = {this.state.stepNumber} gameStatus = {this.state.gameStatus} handlerForHistory = {(i)=>this.moveToStep(i)}/>
            </>
        )
    }
}

ReactDOM.render(<TTT />,document.getElementById("root"))