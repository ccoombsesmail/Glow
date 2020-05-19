import * as THREE from 'three';
// var THREE = require('three')

import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';


// function init() {
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5;

    
  

   
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#e5e5e5");
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
    })

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
    //var mesh = new THREE.Mesh(geometry, material);

    var player = new THREE.Mesh(new THREE.SphereGeometry(1), material);
    player.position.set(0, 0, 0);
    player.name = 'player';
    scene.add(player);
    camera.up.set(0, 0, 1)
    player.add(camera);
    camera.position.set(0, 5, 10);

    var controls = new FirstPersonControls(player);

    controls.movementSpeed = 10;
    controls.lookSpeed = 0.5;
    controls.noFly = true;
    controls.lookVertical = true;
    controls.mouseDragOn = true;
    // meshX = -10;
    for (var i = 0; i < 15; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        scene.add(mesh);
        // meshX += 1;
    }


    var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
    light.position.set(0, 0, 0);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
    light.position.set(0, 0, 25);
    scene.add(light);


// }


var render = function () {
    requestAnimationFrame(render);
    controls.update(.01);
    // var player = scene.getObjectByName("player");
    // camera.lookAt(player.position)
    // let children = scene.children
    // for (i=0; i < children.length;i++) {
    //     children[i].position.x += .01
    // }
    renderer.render(scene, camera);
}

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i]) {
            intersects[i].object.material.color.set(0xff0000)
        }
        // intersects[i].object.material.emissive.setHex(0xff0000)
    }


}

function move(e) {
    var object = scene.getObjectByName("player");
    
    // var direction = new THREE.Vector3();
    // camera.getWorldDirection(direction);
    // var direction2 = direction.clone()
    // direction2['z'] *= -1
    // direction2['y'] *= -1
    // direction2['x'] *= -1
    // console.log(direction)
    // console.log(direction2)
    // camera.updateMatrixWorld()
    // var vector = camera.position.clone();
    // vector.applyMatrix4(camera.matrixWorld);
    // object.position.set(vector['x'], vector['y'], vector['z'] )
    // console.log(vector)
    
    // switch (e.keyCode) {
    //     case 83:
    //         object.position.add(direction2);
    //         break;
    //     case 87:
    //         object.position.add(direction)
    //         break;
    //     default:
    //         break;
    // }

    // switch (e.keyCode) {
    //     case 38:
    //         // camera.position.z -= .1;
    //         object.position.z -= .1;
    //         break;
    //     case 40:
    //         // camera.position.z += .1
    //         object.position.z += .1;

    //         break;

    //     case 37:
    //         // camera.position.x -= .1
    //         object.position.x -= .1;

    //         break;

    //     case 39:
    //         // camera.position.x += .1
    //         object.position.x += .1;
    //         break;
    //     default:
    //         break;
    // }


}

window.addEventListener('keydown', move)
window.addEventListener('mousemove', onMouseMove)
render();
// init()