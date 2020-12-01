const THREE = require('three');
const {Behaviour} = require("./Behaviour");
const {keys} = require('./../../Input/inputs');
const {PointerLockControls} = require('./../../../utils/PointerLock');

class CameraMovement extends Behaviour{

    constructor( owner, blockerRef, cameraRef, boundsRef, speed){
        super(owner);

        this.cameraRef = cameraRef;
        this.boundsRef = boundsRef;
        this.controls = new PointerLockControls( this.cameraRef, document.body);

        blockerRef.addEventListener('click',()=>{
            this.controls.lock();
        });

        this.controls.addEventListener( 'lock' , ()=>{
            console.log('locked');
            blockerRef.style.display = 'none';
        });
        this.controls.addEventListener( 'unlock' , ()=>{
            blockerRef.style.display = 'block';
        });

        this.rays = [
            new THREE.Vector3( 1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3( 0, 0, 1),
            new THREE.Vector3( 0, 0,-1)
        ];

        this.speed = speed;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.raycaster = new THREE.Raycaster(this.cameraRef.position);
        this.raycaster.near = 0.00001;
        this.raycaster.far = 10;

        this.mass = 100.0;
    }

    start(){
    }

    update(deltaTime){

        
        this.velocity.x -= this.velocity.x * this.mass * deltaTime;
        this.velocity.z -= this.velocity.z * this.mass * deltaTime;

        this.velocity.y -= 9.8 * this.mass * deltaTime;

        let front = (keys['w'.charCodeAt(0)] || keys['W'.charCodeAt(0)]) ? 1: 0, back = (keys['s'.charCodeAt(0)] || keys['S'.charCodeAt(0)]) ? 1: 0;
        let left = (keys['d'.charCodeAt(0)] || keys['D'.charCodeAt(0)] ) ? 1: 0, right = (keys['a'.charCodeAt(0)] || keys['A'.charCodeAt(0)]) ? 1: 0;

        this.direction.z = front - back;
        this.direction.x = left - right;
        this.direction.normalize(); // this ensures consistent movements in all directions

        if ( ( keys['w'.charCodeAt(0)]||keys['W'.charCodeAt(0)]) || (keys['s'.charCodeAt(0)]||keys['S'.charCodeAt(0)] ) ) this.velocity.z -= this.direction.z * this.speed * deltaTime;
        if ( ( keys['d'.charCodeAt(0)]||keys['D'.charCodeAt(0)]) || (keys['a'.charCodeAt(0)]||keys['A'.charCodeAt(0)]) ) this.velocity.x -= this.direction.x * this.speed * deltaTime;
      
        this.controls.moveRight( - this.velocity.x * deltaTime );
        this.controls.moveForward( - this.velocity.z * deltaTime );

        this.rays.forEach(raydir=>{
            this.raycaster.set(this.cameraRef.position, raydir);

            let intersections = this.raycaster.intersectObjects(this.boundsRef, true);
            if(intersections.length > 0)
            {
                this.controls.moveRight  (  this.velocity.x * deltaTime );
                this.controls.moveForward(  this.velocity.z * deltaTime );
            }

        });

    }
}

module.exports = {CameraMovement}