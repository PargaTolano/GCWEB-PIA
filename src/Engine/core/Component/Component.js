const {GameObject} = require('./../GameObject');
/**
 * @class Component class for gameobjects
 * @member isComponent Tells you this objects instances are Component Scripts
 */
class Component{
    /**
     * 
     * @param {GameObject} owner 
     */
    constructor(owner){
        this.isComponent = true;

        if (this.constructor === Component)
            throw new Error('Component es una clase abstracta');
    }
}

module.exports = {Component};