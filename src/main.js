const { Engine } = require('./Engine/Engine');

const tokenName = 'StaplesGame-session-web-token';
/**@function load carga la escena de Threejs y Physijs */
function onload(){

    if(localStorage.getItem(tokenName)===null){
        console.log('NO EXISTE XD')
        window.location.pathname = '/login.html'
    }

    var engine = new Engine(1920/1080);
    window.addEventListener("start-game",()=>{
        engine.Run();
    });

    window.addEventListener("game_end",()=>{
    });
}

window.onload = onload;