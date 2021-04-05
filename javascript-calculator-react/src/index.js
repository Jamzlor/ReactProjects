import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';

import Display from './Display.js'
import Keys from './Keys.js'

//regex mise en place
    var endsWithDecimal = /\.$/;
    var includesDecimal = /\./g;
    var endsWithOperator= /[+,x,*,/,\-]$/g;
    var endsWithNegative = /[+,-,*,\-]-$/;
    var zeroAfterOp = /[+,\-,*,/]0$/;
    var fourDecimalOrMore = /\.\d{5,}/;
    var doubleMinus = /--/g;
        

class Calculator extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            formula : "0",
            display : "0",
            evaluated: false,
            negative: false,
            evaluated: false
        }
        this.handleClear = this.handleClear.bind(this)
        this.handleNumber = this.handleNumber.bind(this)
        this.handleOperator = this.handleOperator.bind(this)
        this.handleMultiply = this.handleMultiply.bind(this)
        this.handleDecimal = this.handleDecimal.bind(this)
        this.handleNegative = this.handleNegative.bind(this)
        this.handleEqual = this.handleEqual.bind(this)
    }
    
    
    handleClear(e){
        this.setState(state=>({
            formula: "0",
            display: "0",
            negative: false
        })); 

        this.setState(state=>({
            evaluated: false
        }));
    }

    handleNumber(e){
        var key = e.target.value;
        if(!this.state.evaluated){
            if(!this.state.formula.match(zeroAfterOp)){
                this.setState(state=>({
                    formula: state.formula === "0" ? key : state.formula + key,
                    display: state.formula === "0" || endsWithOperator.test(state.formula) ? key : state.display + key 
                }));
            } else {
                if(key !== "0"){
                    this.setState(state=>({
                        formula : state.formula.slice(0, -1) + key,
                        display: state.display.slice(0, -1) + key
                    }));
                }
            }
        }      
    }
    
    handleDecimal(e){
        var key = e.target.value;
        if(!this.state.display.match(includesDecimal)){
            if(this.state.display === "0"){
                this.setState(state=>({
                    formula: state.formula === "0" ? "0." : state.formula + key,
                    display: "0."
                }));
            } else if(this.state.display.match(endsWithOperator)){
                this.setState(state=>({
                    formula : state.formula + key,
                    display: key
                }));
            } else {
                this.setState(state=>({
                    formula : state.formula + key,
                    display: state.display + key
                }));
            }
        }
    }
   
    handleOperator(e){
        var key = e.target.value;
        if(!this.state.formula.match(endsWithNegative)){
            if(this.state.display.match(endsWithOperator) || this.state.display.match(endsWithDecimal)){
                this.setState(state=> ({
                    display: key,
                    formula : state.formula.slice(0, -1) + key,
                    negative: false
                }));
            } else {
                this.setState(state=>({
                    formula: state.formula + key,
                    display: key,
                    negative: false
                }));
            }   
        }

        this.setState(state=>({
            evaluated: false
        }));
    }

    handleMultiply(e){
        var key = e.target.value;
        if(!this.state.formula.match(endsWithNegative)){
            if(this.state.display.match(endsWithOperator) || this.state.display.match(endsWithDecimal)){
                this.setState(state=> ({
                    display: key,
                    formula : state.formula.slice(0, -1) + "*",
                    negative: false
                }));    
            } else {
                this.setState(state=>({
                    formula: state.formula += "*",
                    display: key,
                    negative: false
                }));
            }
        }

        this.setState(state=>({
            evaluated: false
        }));
    }

    handleNegative(e){
        var key = e.target.value;
        if(this.state.formula === "0"){
            this.setState(state=>({
                formula : key + state.formula,
                display: key + state.display,
                negative: true
            }));
        } else if(this.state.formula === "-0"){
            this.setState(state=> ({
                formula : "0",
                display: "0",
                negative: false
            }));
        } else if(this.state.formula.match(endsWithOperator)){
            this.setState(state=>({
                formula: !state.negative ? state.formula + key : state.formula.slice(0, -1),
                display: key,
                negative: !state.negative
            }));
        } else {
            this.setState(state=> ({
                formula : state.formula + key,
                display: key,
                negative: false
            }));
        }

        this.setState(state=>({
            evaluated: false
        }));
    }

    handleEqual(e){
        var key = e.target.value;
        var expression = this.state.formula;
        expression = expression.replace(doubleMinus, "+")
        if (this.state.formula.match(endsWithOperator) || this.state.formula.match(endsWithDecimal) || this.state.formula.match(endsWithNegative)){
            var answerForOpAndDecimal = expression.match(endsWithNegative) ? eval(expression.slice(0, -2)) : eval(expression.slice(0, -1));
            this.setState(state=>({
                formula : answerForOpAndDecimal.toString().match(fourDecimalOrMore) ? answerForOpAndDecimal.toFixed(4).toString() : answerForOpAndDecimal.toString() ,
                display : answerForOpAndDecimal.toString().match(fourDecimalOrMore) ? answerForOpAndDecimal.toFixed(4).toString() : answerForOpAndDecimal.toString(),
                negative : false,
                evaluated: true
            }))
        } else {
            var answer = (eval(expression));
            this.setState(state=>({
                formula : answer.toString().match(fourDecimalOrMore)? answer.toFixed(4).toString() : answer.toString(),
                display : answer.toString().match(fourDecimalOrMore)? answer.toFixed(4).toString() : answer.toString(),
                negative: false,
                evaluated: true
            })); 
        }
    }


    render(){
        return(
            <div>
                <div id="calculator">
                    <Display formula={this.state.formula} display={this.state.display} />
                    <div><p>{this.state.negative ? "Negative: true" : "Negative: false"}</p></div>
                    <div id="keyPad">
                        <div id="numbers">
                        <Keys type="number" 
                        id="clear" 
                        buttonName="c" 
                        onClick={this.handleClear}
                        />
                            <Keys type="number" 
                        id="divide" 
                        buttonName="/" 
                        onClick={this.handleOperator}
                        />
                            <Keys type="number" 
                        id="seven" 
                        buttonName="7" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="eight" 
                        buttonName="8" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="nine" 
                        buttonName="9" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="four" 
                        buttonName="4" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="five" 
                        buttonName="5" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="six" 
                        buttonName="6" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="one" 
                        buttonName="1" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="two" 
                        buttonName="2" 
                        onClick={this.handleNumber}
                        />
                            <Keys type="number" 
                        id="three" 
                        buttonName="3" 
                        onClick={this.handleNumber}
                        /> 
                        <Keys type="number" 
                        id="zero" 
                        buttonName="0"
                        onClick={this.handleNumber} 
                        />
                            <Keys type="number" 
                        id="decimal" 
                        buttonName="." 
                        onClick={this.handleDecimal}
                        />
                        </div>
                        <div id="operators">
                        <Keys type="operator" 
                        id="multiply" 
                        buttonName="x"
                        onClick={this.handleMultiply} 
                        /> 
                        <Keys type="operator" 
                        id="subtract" 
                        buttonName="-" 
                        onClick={this.handleNegative} 
                        /> 
                        <Keys type="operator" 
                        id="add" 
                        buttonName="+" 
                        onClick={this.handleOperator}
                        /> 
                        <Keys type="operator" 
                        id="equals" 
                        buttonName="=" 
                        onClick={this.handleEqual}
                        />
                        </div>
                    </div>
                </div>
                <div id="footer">
                    <p>Created and Programmed by James Lo</p>
                </div>
            </div>
        );
    }
}


var targetNode = document.getElementById('root');
ReactDOM.render(<Calculator />, targetNode);
