import * as THREE from 'three';


const loadMist = function(scene) {
    let cloudMeshes = []
    let loader = new THREE.TextureLoader();
    loader.load("../../images/smoke.png", function (texture) {
        let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
            
        });
        for (let p = 0; p < 25; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random() * 500 - 450
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 360;
            cloud.material.opacity = 1;
            cloudMeshes.push(cloud)
            scene.add(cloud);
        }
    });

    return cloudMeshes

}


export {loadMist}