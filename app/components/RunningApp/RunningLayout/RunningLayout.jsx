import React from "react";
import './RunningLayout.css';
import { debug } from "util";
import { getRandomInt } from "../../../services/randomService";
import update from 'immutability-helper';
import Catcher from './models/Catcher';
import Barrier from './models/Barrier';
import sides from './models/Sides';
import Starter from './Starter/Starter';
import Timer from './Timer/Timer';
import Actions from '../../../data/Actions';

export default class RunningLayout extends React.Component {

    constructor(props) {
        super(props);

        this.maxBarriers = 8;
        this.maxBarriersPerSide = 4;

        const catcher = new Catcher();

        this.helper = this.getNewBarierHelper(catcher, this.maxBarriersPerSide);
        const barriers = this.helper.initBarriers(this.maxBarriers);

        this.state = {
            startGame: false,
            barriers: barriers,
            catcher: catcher,
            maxScore: 0,
        };

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.maxScore != this.props.maxScore) {
        }
    }

    componentDidMount() {
        Actions.getMaxValue();
    }

    startGame() {
        this.helper.setBarriers(
            this.windowHeight,
            (newBarriers) => {
                this.setState({ barriers: newBarriers });
            },
            () => {
                //clear bariers and catcher if endGame
                this.endGame();
            });

        this.helper.setCatcher(this.windowHeight);

        this.setState({
            startGame: true
        });
    }

    endGame() {
        var newCatcher = this.state.catcher;
        newCatcher.visible = false;
        newCatcher.calculateStyle();
        this.helper.clearIntervals();

        this.helper = this.getNewBarierHelper(newCatcher, this.maxBarriers);
        var barriers = this.helper.initBarriers(this.maxBarriers);

        this.setState({
            barriers: barriers,
            startGame: false,
            catcher: newCatcher,
        });
    }

    checkGameEnd() {
        if (this.helper.checkGameEnd()) {
            this.endGame();
        }
    }

    mouseMove(e) {
        if (this.state.startGame) {
            var x = e.clientX - e.currentTarget.offsetLeft;
            var y = e.clientY - e.currentTarget.offsetTop;

            this.checkGameEnd();

            // 760 - game container width 
            if (x <= (760 - 40)) {
                this.state.catcher.left = x;
                this.state.catcher.top = y;
                this.state.catcher.calculateStyle();
                this.setState({ catcher: this.state.catcher });
            }
        }
    }

    getNewBarierHelper(catcher, maxBarriers) {
        return new barriersHelper(catcher, this.maxBarriersPerSide);
    }

    saveResult(time) {
        if (+time > this.props.maxScore) {
            Actions.addMaxValue(time);
            //addOrUpdateLocalStorageValue('maxValue', time);
        }
    }

    getStarter() {
        if (!this.state.startGame) {
            return <Starter maxScore={this.props.maxScore} onGameStart={() => this.startGame()} />;
        }
    }

    getScore() {
        return <Timer startGame={this.state.startGame} onEndTimer={(time) => this.saveResult(time)} />;
    }

    render() {
        let style = this.state.startGame ? { cursor: "none" } : null;

        return (
            <div className="inner-game-container" style={style} onMouseMove={(e) => this.mouseMove(e)}>
                {
                    this.getStarter()
                }
                {
                    this.getScore()
                }
                {this.state.barriers.map((barrier) => {
                    return <div key={barrier.key} style={barrier.style} className='barrier-container'></div>
                })}
                <div className="cube-container" style={this.state.catcher.style}></div>
            </div>);
    }
}


function barriersHelper(catcher, maxBarPerSide) {
    this.barriers = null;
    this.catcher = catcher;
    this.intervals = [];
    this.timeouts = [];
    this.maxBarPerSide = maxBarPerSide;

    this.setCatcher = function (innerHeight) {
        var catcher = this.catcher;
        catcher.visible = true;
        catcher.top = innerHeight - 100;
        catcher.left = 100;
        catcher.calculateStyle();
    }

    this.checkGameEnd = function () {
        const catcher = this.catcher;
        const bars = this.barriers;

        const cubeObj = { left: catcher.left, right: catcher.left + 40, top: catcher.top, bottom: catcher.top + 40 }

        for (let i = 0; i < bars.length; i++) {
            let barObj = {};
            // 760 - game container width 
            if (bars[i].side === sides.RIGHT) {
                barObj = { left: 760 - bars[i].width, right: 760, top: bars[i].topPosition, bottom: bars[i].topPosition + 40 };
            }
            else {
                barObj = { left: 0, right: bars[i].width, top: bars[i].topPosition, bottom: bars[i].topPosition + 40 };
            }

            if (intersectRect(cubeObj, barObj)) {
                return true;
            }
        }
    }

    this.initBarriers = function (maxBarriers) {
        let barriers = [];
        for (let i = 0; i < maxBarriers; i++) {
            barriers.push(new Barrier(i));
        }
        this.barriers = barriers;
        return barriers;
    }

    this.setBarriers = function (windowHeight, setBarrierState, gameIsEnd) {
        let barriers = this.barriers;

        for (let i = 0; i < this.barriers.length; i++) {
            let timeout = setTimeout(() => {
                barriers[i].visible = true;
                this.setBarrier(barriers[i], setBarrierState, gameIsEnd, windowHeight);
            }, i * 1000);
            this.timeouts.push(timeout);
        }
    }

    this.setBarrier = function (barrier, setBarrierState, gameIsEnd, windowHeight) {
        let interval = setInterval(() => {

            if (this.checkGameEnd()) {
                this.clearIntervals();
                gameIsEnd();
                return;
            }

            if (barrier.topPosition > windowHeight - 60) {
                barrier.topPosition = 0;

                let bars = this.barriers;

                let leftCount = this.barriers.filter((bar) => bar.side === sides.LEFT).length;
                let rightCount = this.barriers.filter((bar) => bar.side === sides.RIGHT).length;

                barrier.setRandomSideAndWidth()

                if (leftCount >= this.maxBarPerSide) {
                    barrier.side = sides.RIGHT;
                }
                else if (rightCount >= this.maxBarPerSide) {
                    barrier.side = sides.LEFT;
                }
            }
            else {
                barrier.topPosition = barrier.topPosition + 20;
            }
            barrier.calculateStyle();

            //callback
            setBarrierState(this.barriers);
        }, 50);

        this.intervals.push(interval);
    }

    this.clearIntervals = function () {

        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        for (let i = 0; i < this.intervals.length; i++) {
            clearInterval(this.intervals[i]);
        }
    }


    function intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
}