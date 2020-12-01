const THREE = require('three');

var moveForward=false;
var moveBackward=false;
var moveLeft = false;
var moveRight = false;
var controls;

var velocity  = new THREE.Vector3();
var direction = new THREE.Vector3();

var onObject  = true;
var top = false;

const {Level1}    = require('./core/Level1');

var vc;
var action;

var world_cam_pos;
var world_target;

var topcam;

window.addEventListener('keyup', e=>{
    if(e.key == "g"){
        top = !top;
    }
})

class Engine{
    constructor(aspect){

        this.aspect = aspect;
        this.clock  = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer();
        
        let vc = document.getElementById('viewport-container');
        this.renderer.setSize(
            vc.clientWidth,
            vc.clientWidth/aspect
        );

        world_cam_pos = new THREE.Vector3(6.3,160,5.8);
        world_target = new THREE.Vector3();

        topcam = new THREE.PerspectiveCamera(90, aspect, 10, 4270);
        topcam.position.set(0,800,0);
        topcam.lookAt(0,0,0);

        this.camera_main = new THREE.PerspectiveCamera(45,aspect,5,4270);
        this.camera_main.position.set(6.3,160,5.8);//tomando en cuenta que el modelo este en posicion 0,0,0 
        this.camera_main.rotation.set(0,0,0);

        this.ortho_cam = new THREE.OrthographicCamera(
            vc.clientWidth/-2,
            vc.clientWidth/2,
            vc.clientHeight/2,
            vc.clientHeight/-2,
            1,1000
        );

        this.renderer.domElement.classList.add(['game-surface']);

        vc = document.getElementById('viewport-container');
        vc.append(this.renderer.domElement);

        window.addEventListener('resize',()=>{

            let vc = document.getElementById('viewport-container');
            this.renderer.setSize(vc.clientWidth, vc.clientWidth/aspect);

            this.ortho_cam.left   = vc.clientWidth/-2;
            this.ortho_cam.right  = vc.clientWidth/2;
            this.ortho_cam.bottom = vc.clientHeight/-2;
            this.ortho_cam.top    = vc.clientHeight/2;
        });

        this.paused = true;
    }

    Run(){
        this.current_level = new Level1(this.camera_main, ()=>{

            this.paused = false;

            this.current_level.start();
               
            var that = this;
            
            requestAnimationFrame(()=>that.Gameloop());

        });
    }

    Pause(){
        this.paused = true;
    }

    Unpause(){
        this.paused = false;
    }

    Gameloop(){

        let delta = this.clock.getDelta();

        if(!this.paused){

            this.current_level.update(delta);

            //update top view camera
            //topcam.position.set(this.camera_main.position.clone().add(new THREE.Vector3(0,600,0)));
            //topcam.lookAt(this.camera_main.position)
        }

        this.renderer.render(this.current_level.scene, top ? topcam : this.camera_main);
        //this.renderer.render(this.current_level.uiscene, this.ortho_cam);

        var that = this;

        requestAnimationFrame(()=>that.Gameloop());
    }
};

module.exports = {Engine};