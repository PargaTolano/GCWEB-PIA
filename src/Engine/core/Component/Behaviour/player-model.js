const THREE       = require('three');
const {Behaviour} = require("./Behaviour");

class PlayerModel extends Behaviour{

    constructor( owner, meshref, camera, offset, rotationOffset){
        super(owner);
        this.isPlayerModel = true;
        this.meshref = meshref;
        this.camera = camera;
        this.offset = offset;
        this.rotationOffset = rotationOffset;


        window.addEventListener('keyup',e=>{
            let speed = 5;
            if(e.key == "j"){
                this.offset.x += speed;
            }
            else if(e.key == "l"){
                this.offset.x -= speed;
            }
            if(e.key == "i"){
                this.offset.y += speed;
            }
            else if(e.key == "k"){
                this.offset.y -= speed;
            }
            if(e.key == "u"){
                this.offset.z += speed;
            }
            else if(e.key == "o"){
                this.offset.z -= speed;
            }
            if(e.key == "p"){
                console.log(`offset: (${this.offset.x},${this.offset.y},${this.offset.z})`)
            }
        })
    }

    start(){
        this.update(0);
    }

    update(deltaTime){
        
        this.meshref.position.set(
            this.camera.position.x ,
            this.camera.position.y ,
            this.camera.position.z 
        );

        this.meshref.rotation.set(
            this.camera.rotation.x,
            this.camera.rotation.y,
            this.camera.rotation.z
        );

        if(this.rotationOffset){
            //this.meshref.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI)
            this.meshref.rotateOnAxis(new THREE.Vector3(0,1,0), this.rotationOffset.y)
        }

        if(this.offset)
        {
            this.meshref.translateX(this.offset.x);
            this.meshref.translateY(this.offset.y);
            this.meshref.translateZ(this.offset.z)
        }
    }
}

module.exports = {PlayerModel}