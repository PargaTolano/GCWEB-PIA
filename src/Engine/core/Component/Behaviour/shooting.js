const THREE = require('three');
const {Behaviour} = require("./Behaviour");

const { addCallback} = require('./../../Input/inputs');

class Shooting extends Behaviour{

    constructor( owner, cameraref, intersectableObjects){
        super(owner);

        let range = 2000;
        this.cameraref = cameraref;
        this.intersectableObjects = intersectableObjects;

        console.log(this.intersectableObjects);

        let direction = new THREE.Vector3();
        this.cameraref.getWorldDirection(direction);
        direction.normalize();

        this.raycaster = new THREE.Raycaster(this.cameraref.position, direction, 0.1, range);

        this.fired = false;
        this.firerate = 1/3;
        this.fireaccum = 0;

        this.mouseInputCallback = this.mouseInputCallback.bind(this);
        addCallback(this.mouseInputCallback);
    }

    mouseInputCallback(e){
        if(!this.fired){

            console.log(this.intersectableObjects)
            let direction = new THREE.Vector3();
            this.cameraref.getWorldDirection(direction);
            direction.normalize();
            
            this.raycaster.set( this.cameraref.position, direction);
            
            let arr = [];
            this.raycaster.intersectObjects ( this.intersectableObjects, true, arr );

            console.log('====================================');
            console.log(arr[0].object.name);
            console.log('====================================');

            this.fired = true;
        }
    }

    start(){
        this.update(0);
    }

    update(deltaTime){
        if(this.fired){
            this.fireaccum += deltaTime;
            if(this.fireaccum >= this.firerate){
                this.fired = false;
                this.fireaccum-= this.firerate;
            }
        }
    }
}

module.exports = {Shooting}