import * as THREE from 'three';

import { Sky } from 'three/examples/jsm/objects/Sky.js';


function initSky(scene) {

    // Add Sky
    let sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    // Add Sun Helper
    let sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = true;
    scene.add(sunSphere);

    // var helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
    // scene.add(helper);

    let effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: ! true
    };

    let distance = 400000;

    let uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
    uniforms["luminance"].value = effectController.luminance;

    let theta = Math.PI * (effectController.inclination - 0.5);
    let phi = 2 * Math.PI * (effectController.azimuth - 0.5);


    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

    sunSphere.visible = effectController.sun;

    uniforms["sunPosition"].value.copy(sunSphere.position);


}
 



export { initSky }