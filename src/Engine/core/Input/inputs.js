var keys= new Array(256);
keys.forEach((item,i)=>{
    keys[i] = false;
});
var prevkeys= new Array(256);
keys.forEach((item,i)=>{
    prevkeys[i] = false;
});
var keydownkeys= new Array(256);
keys.forEach((item,i)=>{
    keydownkeys[i] = false;
});
var keyupkeys= new Array(256);
keys.forEach((item,i)=>{
    keyupkeys[i] = false;
});

//Inputs
const onKeyDown = function ( event ) {
    keys[event.keyCode] = true;
};

const onKeyUp = function ( event ) {
    keys[event.keyCode] = false;
};


//////////////////////////
// MOUSE INPUT HANDLING //
//////////////////////////
callbackArray =  new Array()

var solveCallbacks = e=>{
    for(var i in callbackArray){
        callbackArray[i](e);
    }
}

var addCallback = cb=>callbackArray.push(cb);

const onClick = function (event){
    solveCallbacks(event);
}

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
document.addEventListener('click', onClick, false);

module.exports = {keys, addCallback};