import * as THREE from 'three';


const createSkyBox2 = function (scene) { 


var Imageurl1 = "../../images/corona_rt.png"
var Imageurl2 = "../../images/corona_lf.png"
var Imageurl3 = "../../images/corona_up.png"
var Imageurl4 = "../../images/corona_dn.png"
var Imageurl5 = "../../images/corona_bk.png"
var Imageurl6 = "../../images/corona_ft.png"

var geometry = new THREE.BoxGeometry(1, 1, 1);
var loader = new THREE.CubeTextureLoader();
loader.setCrossOrigin('anonymous');
var textureCube = loader.load([
    Imageurl1, Imageurl2, Imageurl3, Imageurl4, Imageurl5, Imageurl6
]);
var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube,
    side: THREE.BackSide
});
var cube = new THREE.Mesh(geometry, material);
cube.scale.set(400, 400, 400);
scene.add(cube);

return cube
}


export { createSkyBox2 }