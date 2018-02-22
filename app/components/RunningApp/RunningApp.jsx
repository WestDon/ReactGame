import React from "react";
import RunningLayout from '../RunningApp/RunningLayout/RunningLayout.jsx';
import './RunningApp.css';
class RunningApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { gameStart:false };
    }
    
    render() {

        return (
            <div className="game-container">           
                <RunningLayout maxScore={this.props.maxScore}/>
            </div>);
    }
}

export default RunningApp;