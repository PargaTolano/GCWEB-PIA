const THREE = require('three');
const {Behaviour} = require("./Behaviour");

//TODO manejar conexion con socket.io

class Enemy extends Behaviour{

    constructor( owner, meshRef){
        super(owner);

        this.vida = 100;
        this.meshRef = meshRef;
    }

    start(){
    }

    update(deltaTime){
    }
}

module.exports = {Enemy}