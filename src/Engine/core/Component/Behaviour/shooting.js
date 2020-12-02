const THREE = require('three');
const {Behaviour} = require("./Behaviour");

const {GameObject} = require('./../../GameObject');
const {Bullet} = require('./Bullet');

const { addCallback} = require('./../../Input/inputs');

class Shooting extends Behaviour{

    constructor( owner, cameraref, intersectableObjects, gunmeshref, bulletBaseMesh, gamesceneref, sceneref){
        super(owner);

        let range = 2000;
        this.cameraref = cameraref;
        this.intersectableObjects = intersectableObjects;

        let direction = new THREE.Vector3();
        this.cameraref.getWorldDirection(direction);
        direction.normalize();

        this.raycaster = new THREE.Raycaster(this.cameraref.position, direction, 0.1, range);

        this.fired = false;
        this.firerate = 1/3;
        this.fireaccum = 0;

        this.gunmeshref = gunmeshref;
        this.bulletBaseMesh = bulletBaseMesh;
        this.sceneref = sceneref;
        this.gamesceneref = gamesceneref;

        this.mouseInputCallback = this.mouseInputCallback.bind(this);
        addCallback(this.mouseInputCallback);
    }

    mouseInputCallback(e){
        if(!this.fired){

            let direction = new THREE.Vector3();
            this.cameraref.getWorldDirection(direction);
            direction.normalize();
            
            this.raycaster.set( this.cameraref.position, direction);
            
            let arr = [];
            this.raycaster.intersectObjects ( this.intersectableObjects, true, arr );
            if(arr.length > 0){

                let bulletGO = new GameObject(this.gamesceneref);

                this.gamesceneref.push(bulletGO);

                let newBulletMesh = this.bulletBaseMesh.clone();
                newBulletMesh.position.copy(this.gunmeshref.position);
                let bulletComp  = new Bullet(
                    bulletGO,
                    newBulletMesh,
                    arr[0].point.clone(),
                    6000, //4000 para evitar fallos con el arreglo
                    arr[0].distance,
                    [this.intersectableObjects[this.intersectableObjects.length-1]],
                    this.gamesceneref.length-1,
                    this.gamesceneref,
                    this.sceneref
                );

                bulletGO.addComponent(bulletComp);
                this.sceneref.add(newBulletMesh);
            }

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