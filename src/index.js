import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FirstPersonControls } from './controls/controls.js';



import { FireFlies } from './components/fireflys'
import { initSky } from './components/sky'
import { initMusic } from './audio/audio'
import { initModels } from './model_loaders'


var scene, geometry, camera, renderer, flies, darkMaterial, materials, player, finalComposer, bloomComposer, bloomLayer, bloomPass, controls, light
var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;



window.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        document.getElementById('title').classList.remove('fade-out')
        document.getElementById('title').classList.add('fade-in')
    }, 1000) 
    
    setTimeout(() => {
        document.getElementById('title').classList.remove('fade-in')
        document.getElementById('title').classList.add('fade-out')
    }, 5000)

    setTimeout(() => {
        document.getElementsByClassName('welcome-container')[0].style.display = 'flex'
        document.getElementById('title').remove()
    }, 7000)

    document.getElementById('btn').addEventListener('click', () => {
        init()
        render();
        document.querySelector('body').style.background = 'black'
        window.addEventListener('keydown', onSpaceDown)
        document.getElementsByClassName('welcome-container')[0].remove()
    })

    document.getElementById('btn2').addEventListener('click', () => {
        initLowQual('low')
        render();
        document.querySelector('body').style.background = 'black'
        window.addEventListener('keydown', onSpaceDown)
        document.getElementsByClassName('welcome-container')[0].remove()
    })
      
    
    // document.getElementById('title').style.opacity = 1

});



camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
initMusic(camera)
document.getElementById('volume').click()
document.getElementById('volume').click()

function init() {
    scene = new THREE.Scene();
    geometry = new THREE.PlaneBufferGeometry(7500, 7500);
    geometry.rotateX(- Math.PI / 2);

    let groundMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: "black"}));
    groundMesh.position.y = -10
    scene.add(groundMesh);


    initMusic(camera)
    initSky(scene)
    initModels(scene)
    renderer = new THREE.WebGLRenderer({ antialias: true });
   
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(1, 4.0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);



    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })

    darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    materials = {};


    let material = new THREE.MeshLambertMaterial({ color: '#6BD4CF' });
    // var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
    material.emissive.color = 0x008080

    player = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
    
    player.position.set(150, 30, 0);
    player.name = 'player';
    scene.add(player);
    camera.up.set(0, 0, 1)
    player.add(camera);
    camera.position.set(0, 0, 10);

    light = new THREE.PointLight(0xE74E0D, 2, 10);
    player.add(light)


    controls = new FirstPersonControls(player, document);
    controls.movementSpeed = 90;
    controls.lookSpeed = .7;
    controls.noFly = true;
    controls.lookVertical = true;
    controls.mouseDragOn = true;


    flies = new FireFlies(scene)


    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    bloomLayer = new THREE.Layers();

    bloomLayer.set(BLOOM_SCENE);

    player.layers.enable(BLOOM_SCENE);

    let renderScene = new RenderPass(scene, camera);

    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = .2;
    bloomPass.radius = 0;

   


    bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);


    let finalPass = new ShaderPass(
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

    finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

}

var render = function () {
    requestAnimationFrame(render);
    controls.update(.01);

    flies.moveFlies();
    flies.checkCollision(player, bloomPass, light);
    flies.absorbAnimation(player, bloomPass, light)

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




function initLowQual(quality) {

  scene = new THREE.Scene();
  geometry = new THREE.PlaneBufferGeometry(7500, 7500);
  // geometry = new THREE.RingGeometry(0, 750, 64);
  geometry.rotateX(- Math.PI / 2);


  let groundMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: "black" }));
  groundMesh.position.y = -10
  scene.add(groundMesh);


  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  initMusic(camera)
  initSky(scene)
  initModels(scene, quality)
  renderer = new THREE.WebGLRenderer({ antialias: true });
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

  darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  materials = {};


  let material = new THREE.MeshLambertMaterial({ color: '#6BD4CF' });
  // var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
  material.emissive.color = 0x008080

  player = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);

  player.position.set(150, 30, 0);
  player.name = 'player';
  scene.add(player);
  camera.up.set(0, 0, 1)
  player.add(camera);
  camera.position.set(0, 0, 10);

  light = new THREE.PointLight(0xE74E0D, 2, 10);
  player.add(light)


  controls = new FirstPersonControls(player, document);
  controls.movementSpeed = 90;
  controls.lookSpeed = .7;
  controls.noFly = true;
  controls.lookVertical = true;
  controls.mouseDragOn = true;


  flies = new FireFlies(scene)


  let ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  bloomLayer = new THREE.Layers();

  bloomLayer.set(BLOOM_SCENE);

  player.layers.enable(BLOOM_SCENE);

  let renderScene = new RenderPass(scene, camera);

  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0;
  bloomPass.strength = .2;
  bloomPass.radius = 0;




  bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);





  let finalPass = new ShaderPass(
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

  finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);

}