import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

function initModels(scene) {

    var loader = new GLTFLoader();
    loader.setCrossOrigin('anonymous');

    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/gltf');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
        // resource URL
        "../trees/sakuro/scene.gltf",
        function (gltf) {
            let trees1 = gltf.scene
            gltf.scene.scale.set(200, 200, 200);
            scene.add(trees1);
            trees1.position.set(0, -10, 0);
            let trees2;
            let delta = Math.PI / 3
            for (let r = 400; r <= 800; r += 400) {
                delta += Math.PI / 3
                for (let phi = delta; phi <= 2 * Math.PI + delta; phi += Math.PI / 2) {
                    trees2 = trees1.clone()

                    scene.add(trees2);
                    trees2.position.set(r * Math.cos(phi), -10, r * Math.sin(phi));
                }
            }


        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
    )


    loader.load(
        // resource URL
        "../trees/grass/scene.gltf",
        function (gltf) {
            let grass = gltf.scene
            gltf.scene.scale.set(.3, .3, .3);
            scene.add(grass);
            let grass2;
            let delta = 10
            for (let r = 80; r <= 700; r += 40) {
                // delta += .1 + r / (r + Math.sqrt(4005 * r))
                
                    delta += ((r+1)/r)**1.3 - .3
                
                console.log(delta)
                for (let phi = 0; phi <= 2 * Math.PI; phi += Math.PI / (delta)) {
                    grass2 = grass.clone()

                    scene.add(grass2);
                    grass2.position.set(r * Math.cos(phi), -10, r * Math.sin(phi));
                }
            }


        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
    )
}


export { initModels }