import React from 'react'
import './index.css';

const Keys = (props) =>{
    return(
        <button className={`${props.type}Keys`} id={props.id} onClick={props.onClick} value={props.buttonName}>
            {props.buttonName}
        </button>
    );
}



export default Keys; 