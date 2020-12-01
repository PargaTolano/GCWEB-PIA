const { Component } = require('./../Component');
/**
 * @class         Behaviour class for script gameobject standard behaviour
 * @method start  Starts the objects behaviour
 * @method update Updates the objects behaviour
 * @member isBehaviour Tells you this objects instance are Behaviour Scripts
 */
class Behaviour extends Component{
    
    constructor(owner){
        super(owner);
        this.isBehaviour = true;

        if(this.constructor === Behaviour)
            throw new Error("Behaviour es una clase abstracta");
    }

    start(){

    }

    /**
     * @param {number} deltaTime diference in time since last update
     */
    update(deltaTime){

    }
}

module.exports = {Behaviour}