
import * as THREE from 'three';


const createSkyBox = function(scene) { 
    let materialArray = []

    var loader = new THREE.TextureLoader;
    loader.crossOrigin = ''; 

    let texture_ft = loader.load('../../images/corona_ft.png');
    let texture_bk = new THREE.TextureLoader().load('../../images/corona_bk.png');
    let texture_up = new THREE.TextureLoader().load('../../images/corona_up.png');
    let texture_dn = new THREE.TextureLoader().load('../../images/corona_dn.png');
    let texture_rt = new THREE.TextureLoader().load('../../images/corona_rt.png');
    let texture_lf = new THREE.TextureLoader().load('../../images/corona_lf.png');
    console.log(texture_ft)
    console.log(texture_bk)

    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

    for (let i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
    }
    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);

}

export {createSkyBox}