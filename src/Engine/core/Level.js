const THREE = require('three');
const {GameObject} = require('./GameObject');

/**@class Level Class that manages the GameObjects and their interactions
 * @method update Method to update the objects
 * @member gameObjects GameObjects contained in the level
 * @member scene       Scene to render in the graphics object instance
 */
class Level{

    constructor(){
        this.gameObjects = new Array();
        this.scene       = new THREE.Scene();
        this.uiscene     = new THREE.Scene();
        this.accum_rotation = 0;

        if(this.constructor === Level)
            throw new Error('Level: clase abstracta, no instanciar');
    }
    
    load(){
        //TODO Posiblemente no implementar
    }

    start(){
        this.gameObjects.forEach(obj =>{
            obj.start();
        });
    }

    /**
     * @param {number} deltaTime Change in time since last render 
     */
    update(deltaTime){
        this.gameObjects.forEach(obj =>{
            obj.update(deltaTime);
        });
    }
}

module.exports = {Level};