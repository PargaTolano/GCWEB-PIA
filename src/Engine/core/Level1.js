const THREE = require('three');
const {Level} = require('./Level');
const {loadGLTF} = require('./../utils/level-loader');  
const {PlayerModel} = require('./Component/Behaviour/player-model');
const {Shooting} = require('./Component/Behaviour/Shooting');
const {ServerListener} = require('./Component/Behaviour/server-listener');
const {CameraMovement} = require('./Component/Behaviour/cameraMovement')
const {Enemy} = require('./Component/Behaviour/enemy.js');
const {GameObject} = require('./GameObject');
const { SphereGeometry, MeshLambertMaterial } = require('three');
const enemy = require('./Component/Behaviour/enemy.js');

var tl = new THREE.TextureLoader();

class Level1 extends Level {
    constructor(main_camera, onAfterLoad){
        super();

        this.objectsMap = new Map();

        this.objectsMap['main_camera'] = main_camera;

        loadGLTF('/resources/levels/level1/level1.glb')
        .then(async gltfObject=>{

            this.scene = gltfObject.scene;
            this.uiscene = new THREE.Scene();


            let character = await loadGLTF('/resources/chracters/char_shoot.glb');
            let character2 = await loadGLTF('/resources/chracters/char_shoot2.glb');
            let pMesh = character.scene.getObjectByName("char_geo");
            let pMesh2 = character2.scene.getObjectByName("body");

            //modificar parametros graficos del modelo
            pMesh.material.side = THREE.DoubleSide;
            pMesh.receiveShadow = true;
            pMesh.castShadow = true;
            pMesh.frustumCulled = false;
            pMesh.renderOrder = 10;
            pMesh.material.depthTest= false;
            //envMap
            let cubemap = new THREE.CubeTextureLoader().setPath( 'resources/textures/cube_cosmic/' ) .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
            this.scene.background = cubemap;

            pMesh2.material.envMap = cubemap;
            pMesh2.material.side = THREE.DoubleSide;
            pMesh2.receiveShadow = true;
            pMesh2.castShadow = true;
            pMesh2.frustumCulled = false;
            
            character.scene;
            character.scene.renderOrder = 10;
            
            this.objectsMap['character']  = character.scene;//.getObjectByName('Armature');
            //character.scene.clone(new THREE.Scene());//
            this.objectsMap['enemy']      =  character2.scene;//new THREE.Mesh(new SphereGeometry(50,24,24), new MeshLambertMaterial({color:0x995555}));

            let enemyMeshes = [];
            character2.scene.traverse(obj3d=>{
                if(obj3d.isMesh){
                    enemyMeshes.push(obj3d);
                }
            })

            let staples = await loadGLTF('/resources/assets/staple.glb');
            this.objectsMap['staple'] = staples.scene.getObjectByName("Staple").clone();
            this.objectsMap['staple'].scale.set(4,4,4);

            /* AUDIO
            const listener = new THREE.AudioListener();
            this.objectsMap['main_camera'].add( listener );

            // create a global audio source
            const sound = new THREE.Audio( listener );

            // load a sound and set it as the Audio object's buffer
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load( '/resources/sound/audio.mp3', function( buffer ) {
            	sound.setBuffer( buffer );
            	sound.setLoop( true );
            	sound.setVolume( 0.01 );
            	sound.play();
            });*/

            let levelobjects = [];
            gltfObject.scene.remove(gltfObject.scene.getObjectByName('rp_eric_rigged_001_geo'));
            gltfObject.scene.traverse(object3d=>{
                if(object3d.isMesh)
                {
                    object3d.castShadow = true; //default is false
                    object3d.receiveShadow = true; 
                    levelobjects.push(object3d);
                }
            });

            this.objectsMap['t_crosshair'] = tl.load('/resources/textures/crosshair.png');

            this.objectsMap['bounds'] = [ ...levelobjects, ...enemyMeshes];

            this.load(onAfterLoad);
        })
        .catch(err=>console.error(err));
    }
    
    load(onAfterLoad){
        //cargar jugador y sus scripts
        let playerGameObject = new GameObject(this);
        this.objectsMap['main_camera'].translateX(100);
        let cameraMovementComponent = new CameraMovement(
            playerGameObject, //Owner
            document.getElementById('blocker'),
            this.objectsMap['main_camera'],
            this.objectsMap['bounds'],
            48000.0
        );
        this.objectsMap['character'];
        let playerModelComp = new PlayerModel( 
            playerGameObject,                  //OWNER
            this.objectsMap['character'],      //MESH
            this.objectsMap['main_camera'],   //CAMERA
            new THREE.Vector3(-5,-150, -25),  //POSITIONAL OFFSET
            new THREE.Vector3( 0, Math.PI, 0) //ROTATIONAL OFFSET
        );
        this.scene.add(this.objectsMap['character']);
        playerGameObject.addComponent( cameraMovementComponent );
        playerGameObject.addComponent( playerModelComp         );
        
        let enemyMesh = this.objectsMap['enemy'];
        //Modelo del jugador enemigo
        let enemyModelGameObject = new GameObject(this);
        let enemyModelBehaviour  = new Enemy(enemyModelGameObject, enemyMesh);
        enemyModelGameObject.addComponent(enemyModelBehaviour);
        this.scene.add(enemyMesh);
        
        //comportamiento de disparo
        let shootingGameObject = new GameObject(this);
        let shootingComponent  = new Shooting(
            shootingGameObject, 
            this.objectsMap['main_camera'],
            this.objectsMap['bounds'],
            this.objectsMap['main_camera'],
            this.objectsMap['staple'],
            this.gameObjects,
            this.scene
        );
        shootingGameObject.addComponent(shootingComponent);
        
        //Listener de la conexion
        let serverListener = new GameObject(this);
        let serverListenerBehaviour = new ServerListener(
            serverListener,
            `http://${location.hostname}:4000`,
            this.objectsMap['main_camera'],
            enemyMesh,
            enemyModelBehaviour
        );
        serverListener.addComponent(serverListenerBehaviour);
        
        //Agregar Luces
        let ambient =  new THREE.AmbientLight(0xAAAAAA, 1);
        ambient.name = 'ambient_light';
        this.scene.add(ambient);
        
        let directional = new THREE.DirectionalLight(0xEEFFCC, 0.5);
        directional.name = 'direct_light';
        directional.position.set(500,200,0);
        directional.castShadow = true;
        this.scene.add(directional);
        
        //Creacion UI
        let crosshairgeometry = new THREE.PlaneGeometry(300,300);
        let crosshairmaterial = new THREE.MeshBasicMaterial({map:this.objectsMap['t_crosshair']});
        let crosshair = new THREE.Mesh(crosshairgeometry, crosshairmaterial);

        this.uiscene.add(crosshair);

        this.gameObjects.push(
            playerGameObject,
            shootingGameObject,
            serverListener
        );

        onAfterLoad();
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

module.exports = {Level1};