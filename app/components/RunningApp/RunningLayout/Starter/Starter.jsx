import React from "react";
import './Starter.css';

export default class Starter extends React.Component {

    render() {
        return (<div className="start-game-containier">
            <div className="start">
                <a className="btn btn-primary btn-lg" onClick={() => { this.props.onGameStart() }}>
                    <span className="glyphicon glyphicon-thumbs-up start">
                    </span>
                    Start game
                 </a>
            </div>

            <div className="score">
                <span className="score-text">Highest score:</span>
                <span className="score-result">{this.props.maxScore}</span>
            </div>

        </div>);
    }

}