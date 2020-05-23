import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import {createSkyBox} from './components/skybox'
import {createSkyBox2} from './components/skybox2'
import {loadMist} from './components/mist'
import {FireFlies} from './components/fireflys'
import {initSky} from './components/sky'





// function init() {

    var scene = new THREE.Scene();

    // var mistMeshes = loadMist(scene)

var loader = new GLTFLoader();
loader.setCrossOrigin('anonymous');

var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
    // resource URL
    "../tree2/scene.gltf",
    function (gltf) {
        let trees1 = gltf.scene
        scene.add(trees1);
        trees1.position.set(-200, -100, 0);
        let trees2;

        // for (let r = 100; r <= 200; r += 100){
            // for (let phi = 0; phi <= 2*Math.PI; phi += Math.PI/2){
            //     trees2 = trees1.clone()
            //     scene.add(trees2);
            //     trees2.position.set(-300 + 100 * Math.cos(phi), -100, 100 * Math.sin(phi));
            // }
        // }
     

    },
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
)

var geometry = new THREE.PlaneBufferGeometry(7500, 7500);
geometry.rotateX(- Math.PI / 2);

var groundMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: "black"}));
groundMesh.position.y = -10
scene.add(groundMesh);

// loader.load(
//     // resource URL
//     "../tree2/scene.gltf",
//     function (gltf) {
//         let trees1 = gltf.scene
//         scene.add(trees1);

//         trees1.position.set(0, 10, -10);

//     }
// )

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    initSky(scene)

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setClearColor("#001111");
    // renderer.setClearColor(scene.fog.color);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(1, 4.0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);



    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })

    var darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    var materials = {};
    var materials2 = {};

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
    material.emissive.color = 0x008080

    var player = new THREE.Mesh(new THREE.SphereGeometry(1), material);
    player.position.set(300, 0, 0);
    player.name = 'player';
    scene.add(player);
    camera.up.set(0, 0, 1)
    player.add(camera);
    camera.position.set(0, 0, 10);
    var light = new THREE.PointLight(0xE74E0D, 100, 100);
    player.add(light)


    var controls = new FirstPersonControls(player);
    controls.movementSpeed = 100;
    controls.lookSpeed = 1;
    controls.noFly = true;
    controls.lookVertical = true;
    controls.mouseDragOn = true;


    var flies = new FireFlies(scene)


    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    var ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

// }

    var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    var bloomLayer = new THREE.Layers();
    var bloomLayer2 = new THREE.Layers();

    bloomLayer.set(BLOOM_SCENE);

    player.layers.enable(BLOOM_SCENE)

    var renderScene = new RenderPass(scene, camera);

    var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2;
    bloomPass.radius = 0;

   


    var bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);


  


    var finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            defines: {}
        }), "baseTexture"
    );
    finalPass.needsSwap = true;

    var finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);


var render = function () {
    requestAnimationFrame(render);
    controls.update(.01);

    flies.moveFlies()
    flies.checkCollision(player, bloomPass)

 
    // composer.render();

    // render scene with bloom
    renderBloom(true);
    // render the entire scene, then render bloom scene on top
    finalComposer.render();
    // renderer.render(scene, camera);

}


function renderBloom(mask) {

    if (mask === true) {

        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);

    } 
    
    // else {

    //     camera.layers.set(BLOOM_SCENE);
    //     bloomComposer.render();
    //     camera.layers.set(ENTIRE_SCENE);

    // }

}


function darkenNonBloomed(obj) {
   
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {

        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;

    }


   
}



function restoreMaterial(obj) {

    if (materials[obj.uuid]) {

        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];

    }

}




function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);



}

function onSpaceDown(event) {
    if (event.keyCode === 32) {
        bloomPass.strength += .03
    }
    if (event.keyCode === 17) {
        controls.enabled = !controls.enabled
    }

}

// window.addEventListener('mousemove', onMouseMove)
 window.addEventListener('keydown', onSpaceDown)
render();
// init()