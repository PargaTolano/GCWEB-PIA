const THREE = require('three');

const {Component } = require('./Component/Component');
const {Level}      = require('./Level');

/**@class GameObject Class that defines the behaviour and use of an object in scene
 * @method start  Method to initialize behavioural objects
 * @method update Method to update the objects
 */
class GameObject{

    /**
     * 
     * @param {Level} level the level where the gameobject belongs
     */
    constructor(level){
        this.components = new Array();
        this.level = level;
    }

    start(){
        this.components.forEach(comp=>{
            if(comp.isBehaviour)
                comp.start();
        });
    }

    /**
     * @param {Component} component 
     */
    addComponent(component){
        if(component.isComponent)
            this.components.push(component);
    }

    /**
     * @param {number} deltaTime Change in time since last render 
     */
    update(deltaTime){
        this.components.forEach(comp=>{
            if(comp.isBehaviour)
                comp.update(deltaTime);
        });
    }
}

module.exports = {GameObject};