const THREE = require('three');
const {Behaviour} = require("./Behaviour");
const io = require('socket.io-client');
const { Euler } = require('three');

//TODO manejar conexion con socket.io

const GAMESTATE_NONE        = 0;
const GAMESTATE_ENQUEDED    = 1;
const GAMESTATE_STARTING    = 2;
const GAMESTATE_INGAME      = 3;
const GAMESTATE_FINALIZING  = 4;

class ServerListener extends Behaviour{

    constructor( owner, serverURL, meshref, playerCompRef, enemyCompRef){
        super(owner);

        this.socket = io(serverURL);
        this.meshref = meshref;
        this.player_id = "";
        this.game_room = null;
        this.queue_position = 0;
        this.gamestate = GAMESTATE_NONE; 


        let euler =  new Euler(0,0,0, 'YXZ');

        this.socket.on('coneccion-made',params=>{
            this.player_id = params.player_id;
            console.log(this.player_id)
        });

        this.socket.on('enqueued',queuePos=>{
            this.queue_position = queuePos;
            this.gamestate= GAMESTATE_ENQUEDED;
        });

        this.socket.on('game-found', params=>{
            this.gamestate = GAMESTATE_STARTING;
            this.game_room = params.room;
        });
        
        this.socket.on('initGame',()=>{
            this.gamestate = GAMESTATE_INGAME;
            this.player_id = params.id;
        });
        this.socket.on('game-end',()=>{
            this.gamestate = GAMESTATE_FINALIZING;
        });
        this.socket.on('shot-at',danio=>{
            this.playerCompRef.vida -= danio;
        });
        this.socket.on('update-enemy-position',position=>{
            
            if(position){

                enemyCompRef.meshRef.position.set(position.x,position.y,position.z);

                euler.y = position.ry + Math.PI;

                enemyCompRef.meshRef.quaternion.setFromEuler( euler );
            }
            else
                console.log("Error on updating enemy position")
        });
    }

    start(){

    }

    update(deltaTime){
        if(this.socket.connected && (this.game_room !== null))
        {
            var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
            euler.setFromQuaternion(this.meshref.quaternion);
            this.socket.emit('update-position',
                {
                    x:this.meshref.position.x,
                    y:0, 
                    z:this.meshref.position.z,
                    ry:euler.y,
                    room:this.game_room
                }
            );
        }
    }
}

module.exports = {ServerListener}