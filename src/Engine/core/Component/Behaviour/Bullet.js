const THREE = require('three');
const {Behaviour} = require("./Behaviour");

let rxspeed = Math.PI*4, ryspeed = Math.PI*2;
let up = new THREE.Vector3(0,1,0), right = new THREE.Vector3(1,0,0);

class Bullet extends Behaviour{

    constructor(owner, mesh, destiny, speed, maxdistance, objs, index, gamescene, scene){
        super(owner);

        this.mesh      = mesh;
        this.start     = this.mesh.position.clone();
        this.destiny   = destiny;
        this.direction = this.destiny.clone().sub(this.start.clone()).normalize();
        this.speed     = speed;
        this.maxdistance = maxdistance;
        this.objs      = objs;
        this.index     = index;
        this.gamescene = gamescene;
        this.scene     = scene;
        this.raycaster = new THREE.Raycaster(this.mesh.position, this.direction, 0, 50);
    }

    start(){}

    update(deltaTime){
        
        this.mesh.position.add(this.direction.clone().multiplyScalar(deltaTime*this.speed));
        this.mesh.rotateOnAxis(up, rxspeed*deltaTime);
        this.mesh.rotateOnAxis(right, ryspeed*deltaTime);

        let distanciaDesdeOrigen = this.mesh.position.clone().sub(this.start.clone()).length();

        let arr = this.raycaster.intersectObjects(this.objs, true);

        if(distanciaDesdeOrigen >= this.maxdistance || arr.length > 0){

            this.gamescene.splice(this.index, 1);
            this.scene.remove(this.mesh);
            delete this;
            
            if(arr.length > 0)
            {
                //console.log("IMPACTO ENEMIGO")
            }
        }
    }
}

module.exports = {Bullet};