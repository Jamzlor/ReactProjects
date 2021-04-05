import React from 'react'
import './index.css';

const Display = (props) => {
        return(
            <div id="display">
                <p className="display-alignment" id="formula">{props.formula}</p>
                <p className="display-alignment" id="displayContent">{props.display} </p>
            </div>
        );
}

export default Display;