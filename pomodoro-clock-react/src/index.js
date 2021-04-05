import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';

//this function will convert the time from seconds to MM:SS format
function formattedTime(timeInSec) {
    var min = Math.floor((timeInSec % 3600) / 60);
    var sec = Math.floor(timeInSec % 60);

    var time = (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    return time;
}
var audio = new Audio('http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav');
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sessionLengthDis: 25,
            breakLengthDis: 5,
            breakLength: 300,
            sessionLength: 1500,
            breakLengthSelected: 300,
            sessionLengthSelected: 1500,
            cycle: "Session",
            timeRunning: false
        };

        this.handleSessionDecrease = this.handleSessionDecrease.bind(this);
        this.handleSessionIncrease = this.handleSessionIncrease.bind(this);
        this.handleBreakDecrease = this.handleBreakDecrease.bind(this);
        this.handleBreakIncrease = this.handleBreakIncrease.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.playButton = this.playButton.bind(this);
        this.pauseButton = this.pauseButton.bind(this);
        this.toggleSessionBreak = this.toggleSessionBreak.bind(this);
    }

    handleSessionIncrease() {
        if(this.state.sessionLength < 3600){
            this.setState(state => ({
                sessionLengthDis: state.sessionLengthDis + 1,
                sessionLength : state.sessionLength + 60,
                sessionLengthSelected: state.sessionLengthSelected + 60
            }));
        }
    }

    handleSessionDecrease() {
        if(this.state.sessionLengthDis > 1){
            this.setState(state => ({
                sessionLengthDis: state.sessionLengthDis - 1,
                sessionLength : state.sessionLength - 60,
                sessionLengthSelected: state.sessionLengthSelected - 60
            }));
        }
    }

    handleBreakIncrease() {
        if(this.state.breakLength < 3600){
            this.setState(state => ({
                breakLengthDis: state.breakLengthDis + 1,
                breakLength : state.breakLength + 60,
                breakLengthSelected: state.breakLengthSelected + 60
            }));
        }
    }

    handleBreakDecrease() {
        if(this.state.breakLengthDis > 1){
            this.setState(state => ({
                breakLengthDis: state.breakLengthDis - 1,
                breakLength : state.breakLength - 60,
                breakLengthSelected: state.breakLengthSelected
            }));
        }
        
    }

    handleReset() {
        this.pauseButton();
        this.setState(state => ({
            sessionLengthDis: 25,
            breakLengthDis: 5,
            breakLength: 300,
            sessionLength: 1500,
            breakLengthSelected: 300,
            sessionLengthSelected: 1500,
            cycle: "Session",
            timeRunning: false
        }));
    }

    toggleSessionBreak (){
        (this.state.cycle === "Session")?
        this.setState(state => ({
            cycle: "Break"
        })) : 
        this.setState(state => ({
            cycle: "Session"
        }))
    }

    runTimer(){
        if(this.state.cycle === "Session"){
            if(this.state.sessionLength > 0){
                this.setState(state => ({
                    sessionLength: state.sessionLength - 1
                }));           
            } else {
                audio.play();
                this.toggleSessionBreak();
                this.setState(state => ({
                    sessionLength: state.sessionLengthSelected
                }));
            }
        } else {
            if(this.state.breakLength > 0){
                this.setState(state => ({
                    breakLength: state.breakLength - 1
                }));
            } else {
                audio.play();
                this.toggleSessionBreak();
                this.setState(state => ({
                    breakLength: state.breakLengthSelected
                }));
            }
        }
    } 

    playButton() {
            if(!this.state.timeRunning){
                this.myInterval = setInterval(() => {
                    this.runTimer();
                }, 1000);
                this.setState(state =>({
                    timeRunning: !state.timeRunning
                }));
            }
        }
    

    pauseButton() {
        if(this.state.timeRunning){
            clearInterval(this.myInterval);
            this.setState(state =>({
                timeRunning: !state.timeRunning
            }));
        }
     
    }   
    render(){
        return(
            <div id="wrapper">
                <Title />
                <LengthSelectors 
                sessionIncrease={this.handleSessionIncrease}
                sessionDecrease={this.handleSessionDecrease}
                breakIncrease={this.handleBreakIncrease}
                breakDecrease={this.handleBreakDecrease}
                break={this.state.breakLengthDis} 
                session={this.state.sessionLengthDis} />
                <TimerLabel cycle={this.state.cycle} />
                <Timer minutesLeft={this.state.cycle === "Session" ? this.state.sessionLength : this.state.breakLength}
                secondsLeft={this.state.secondsLeft} />
                <Controls playBtn={this.playButton} pauseBtn={this.pauseButton} reset={this.handleReset}  />
                <Footer />
            </div>
        );
    }
}


// components
const Title = (props) =>{
    return(
        <span id="title">Pomodoro Clock</span>
    );
}

const LengthSelectors = (props) =>{
    return(
        <div className="flex-container" id="lengthSelectors">
            <div className="blockSpacing flex-container" id="break-label">
                <label className="buttonSpacing decrement" onClick={props.breakDecrease} id="break-decrement">&lt;</label>
                <h2 id="break-label"> Break Length </h2>
                <label className="buttonSpacing increment" onClick={props.breakIncrease} id="break-increment">&gt;</label>
                <p id="break-length">{props.break}</p>
            </div>
            <div className="blockSpacing flex-container" id="session-label">
                <label className="buttonSpacing decrement" onClick={props.sessionDecrease} id="session-decrement">&lt;</label>
                <h2 id="session-label"> Session Length </h2>                    
                <label className="buttonSpacing increment" onClick={props.sessionIncrease} id="session-increment">&gt;</label>
                <p id="session-length">{props.session}</p>
            </div>
        </div> 
    ) ;            
}

const TimerLabel = (props) =>{
    return (
        <div id="timer-label">
            <p>{props.cycle}</p>
        </div>
    )
}

const Timer = (props) =>{
    return (
        <div id="timer-display" className="flex-container">
            <p id="time-left">{formattedTime(props.minutesLeft)}</p>
        </div>
    );
}

const Controls = (props) => {
    return (
        <div className="flex-container startStop" id="controls">
            <label className="controlsSpacing playPause" onClick={props.playBtn}>
                <i className="fa fa-play"/>
            </label>
            <label className="controlsSpacing playPause" onClick={props.pauseBtn}>
                <i className="fa fa-pause"/>
            </label>
            <label className="controlsSpacing" id="reset" onClick={props.reset}>Reset</label>
        </div>
    );
}

const Footer = () => {
    return(
        <div id="footer">
            <h4>Created and Coded by James Lo</h4>
        </div>
    )
}

var targetNode = document.getElementById("root");
ReactDOM.render(<App />, targetNode)