import React from 'react';
import ReactDOM from 'react-dom';
import './master.css';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            description: 'Click on a square space to start game.',
            circleTurn: true,
            gameStart: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleClick(e){
        e.preventDefault();
        e.target.innerHTML = this.state.circleTurn ? "O" : "X";
        this.setState(state => ({
            gameStart: true,
            circleTurn: !state.circleTurn
        }))
        console.log(e)

    }

    handleReset(){
        window.location.reload()
    }
    
    render(){
        return(
            <div className="wrapper">
                <h1>Tic Tac Toe</h1>
                <h2>{(!this.state.gameStart ? this.state.description : (this.state.circleTurn ? "O's turn" : "X's turn"))}</h2>
                <PlayArea handleClick={this.handleClick} />
                <ResetButton handleReset={this.handleReset} />
            </div>
        );
    }
}

function PlayArea (props){
        return (
            <div id="playArea" className='flex-container'>
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
                <Square handleClick={props.handleClick} />
            </div>
        );
    
}

function Square(props){
    return <p className="box" onClick={props.handleClick}></p>
};

function ResetButton(props){
    return <button id='reset' className='reset' onClick={props.handleReset}>Reset</button>
};

const targetNode = document.getElementById('root');
ReactDOM.render(<App />, targetNode)