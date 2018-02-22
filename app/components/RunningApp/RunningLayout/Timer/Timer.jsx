import React from 'react';
import './Timer.css';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
        };
        this.interval = null;
    }

    checkGame(props) {
        if (props.startGame) {
            this.startTimer();
        }
        else {
            this.endTimer();
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.setState({ seconds: this.state.seconds + 1 })
        }, 1000)
    }

    endTimer() {
        this.props.onEndTimer(this.state.seconds);
        this.setState({ seconds: 0 });
        clearInterval(this.interval);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.startGame != this.props.startGame) {
            this.checkGame(nextProps);
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.startGame ?
                        <div className="timer-container">
                             {`SCORE: ${this.state.seconds}`}
                        </div> :
                        null
                }
            </div>
        )
    }
}