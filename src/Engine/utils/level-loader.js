var FBXLoader = require('three-fbx-loader');
var GLTFLoader = require('three-gltf-loader');

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

/**
 * @function getFBXAssets Loads geometry and materials in a FBX Scene
 * @param {string} file path to the fbx file
 * @returns {Promise} promise of the 3d assets of the FBX Scene
 */
function loadFBX(file){
    return new Promise((resolve, reject)=>{
        fbxLoader.load(file,success=>{
            resolve(success);
        },progress=>{},
        err=>{
            reject(err);
        });
    });
}

/**
 * @function getFBXAssets Loads geometry and materials in a GLTF Scene
 * @param   {string} file path to the GLTF or GLB file
 * @returns {Promise} promise of the 3d assets of the GLTF Scene
 */
function loadGLTF(file){
    return new Promise((resolve, reject)=>{
        gltfLoader.load(file,success=>{
            resolve(success);
        },progress=>{},
        err=>{
            reject(err);
        });
    });
}
module.exports = {loadFBX,loadGLTF};