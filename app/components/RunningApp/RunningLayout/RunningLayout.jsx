import React from "react";
import './RunningLayout.css';
import { debug } from "util";
import { getRandomInt } from "../../../services/randomService.js";
import update from 'immutability-helper';

export default class RunningLayout extends React.Component {

    constructor(props) {
        super(props);

        this.maxBarriers = 8;
        this.state = {
            startGame: false,
            barriers: this.initBarriers(),
            catcher: new Catcher(),
            maxBariersPerSide: 5,
        }; //Initialize state

        this.helper = new barriersHelper(this.state.barriers, this.state.catcher);

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }

    componentWillUpdate(nextProps, nextState){
        this.helper = new barriersHelper(nextState.barriers, nextState.catcher);
    }

    startGame(){

        this.setGameBarriers(this.helper);
        this.helper.startGame(this.windowHeight);

        this.setState({ 
            startGame: true
        });
    }

    endGame(){
        var newCatcher = this.state.catcher;
        newCatcher.visible = false;
        newCatcher.calculateStyle();

        //this.helper.clearIntervals();
        var barriers = this.initBarriers();
        
        this.setState({
             barriers: barriers,
             startGame: false, 
             catcher: newCatcher, 
             });
    }

    setGameBarriers() {
        this.helper.setBarriers(
            this.windowHeight,
            (newBarriers) => {
                this.setState({barriers: newBarriers});
        },
        () => {
            //clear bariers and catcher if endGame
            this.endGame();
        });
    }

    initBarriers() {
        let barriers = [];
        for (let i = 0; i < this.maxBarriers; i++) {
            barriers.push(new Barrier(i));
        }
        return barriers;
    }

    checkGameEnd(){
        if(this.helper.checkGameEnd()){
            this.endGame();
        }
    }

    mouseMove(e) {
        if(this.state.startGame){
            var x = e.clientX - e.currentTarget.offsetLeft;
            var y = e.clientY - e.currentTarget.offsetTop;

            this.checkGameEnd();

            // 760 - game container width 
            if(x <= (760 - 40)) {
                this.state.catcher.left = x;
                this.state.catcher.top = y;
                this.state.catcher.calculateStyle();
                this.setState({catcher: this.state.catcher});
            }
        }
    }

    render() {
        return (
            <div className="inner-game-container" onMouseMove={(e) => this.mouseMove(e)}>
                {
                    !this.state.startGame ?
                        <div className="start-game-containier">
                            <div className="start">
                                <a className="btn btn-primary btn-lg" onClick={() => {this.startGame()}}>
                                    <span className="glyphicon glyphicon-thumbs-up start">
                                    </span>
                                    Start game
                                </a>
                            </div>
                        </div> : null
                }
                {this.state.barriers.map((barrier) => {
                    return <div key={barrier.key} style={barrier.style} className='barrier-container'></div>
                })}
                <div className="cube-container" style={this.state.catcher.style}></div>
            </div>);
    }
}

const sides = {
    LEFT: 0,
    RIGHT: 1,
}



class Barrier {
    constructor(index) {
        this.topPosition = 0;
        this.side = sides.LEFT;
        this.key = index;
        this.width = 0;
        this.visible = false;
        this.style = "";

        this.setRandomSideAndWidth();
        this.calculateStyle();
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setRandomSideAndWidth() {
        this.width = this.getRandomInt(50, 400);
        
        this.side = this.getRandomInt(0, 1);
    }

    calculateStyle() {
        var barrierStyle = {};

        this.setSidePosition(this, barrierStyle);

        barrierStyle.top = this.topPosition
        barrierStyle.width = this.width;

        if (this.visible === false) {
            barrierStyle.display = 'none';
        }
        else {
            barrierStyle.display = 'initial';
        }

        this.style = barrierStyle;
    }

    setSidePosition(barrier, barrierStyle) {
        switch (barrier.side) {
            case sides.LEFT:
                barrierStyle.left = 0;
                break;
            case sides.RIGHT:
                barrierStyle.right = 0;
                break;
        }
    }
}


class Catcher {
    constructor(index) {
        this.visible = false;
        this.style = "";
        
        this.left = 0;
        this.top = 0;

        this.calculateStyle();
    }



    calculateStyle() {
        var catcherStyle = {};

        catcherStyle.top = this.top;
        catcherStyle.left = this.left;

        if (this.visible === false) {
            catcherStyle.display = 'none';
        }
        else {
            catcherStyle.display = 'initial';
        }

        this.style = catcherStyle;
    }

    setSidePosition(barrier, barrierStyle) {
        switch (barrier.side) {
            case sides.LEFT:
                barrierStyle.left = 0;
                break;
            case sides.RIGHT:
                barrierStyle.right = 0;
                break;
        }
    }
}

function barriersHelper(barriers, catcher){
    this.barriers = barriers;
    this.catcher = catcher;
    this.intervals = [];
    this.timeouts = [];

    this.startGame = function(innerHeight){
        var catcher = this.catcher;
        catcher.visible = true;
        catcher.top = innerHeight - 100;
        catcher.left = 100;
        catcher.calculateStyle();
    }

    this.checkGameEnd = function(){
        const catcher = this.catcher;
        const bars = this.barriers;

        const cubeObj = {left: catcher.left, right: catcher.left + 40, top: catcher.top, bottom: catcher.top + 40}

        for (let i = 0; i < bars.length; i++) {
            let barObj = {};
            // 760 - game container width 
            if(bars[i].side===sides.RIGHT){
                barObj = {left: 760 - bars[i].width, right: 760, top: bars[i].topPosition, bottom: bars[i].topPosition + 40};
            }
            else{
                barObj = {left: 0, right: bars[i].width, top: bars[i].topPosition, bottom: bars[i].topPosition + 40};
            }

            if(intersectRect(cubeObj, barObj)){
                return true;
            }
        }
    }

    this.setBarriers = function(windowHeight, setBarrierState, gameIsEnd){
        let barriers = this.barriers;

        for (let i = 0; i < this.barriers.length; i++) {
            let timeout = setTimeout(() => {
                barriers[i].visible = true;
                this.setBarrier(barriers[i], setBarrierState, gameIsEnd, windowHeight);
            }, i * 1000);
            this.timeouts.push(timeout);
        }
    }

    this.setBarrier = function(barrier, setBarrierState, gameIsEnd, windowHeight){
        let interval = setInterval(() => {

            if(this.checkGameEnd()){
                this.clearIntervals();
                gameIsEnd();
                return;
            }

            if (barrier.topPosition > windowHeight - 60) {
                barrier.topPosition = 0;
                barrier.setRandomSideAndWidth();
            }
            else {
                barrier.topPosition = barrier.topPosition + 20;
            }
            barrier.calculateStyle();
            
            //callback
            setBarrierState(this.barriers);
        }, 100);

        this.intervals.push(interval);
    }

    this.clearIntervals = function(){
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