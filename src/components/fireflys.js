import * as THREE from 'three';

export class FireFlies {

    constructor(scene) {
        let geometry = new THREE.SphereGeometry(.1);
        let material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
        this.flies = []
        this.scene = scene
        this.moveSpeed = .01
        for (let i = 0; i < 15; i++) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = (Math.random() - 0.5) * 10;
            this.scene.add(mesh);
            this.flies.push(mesh)
        }
    }


    moveFlies() {

        for (let i = 0; i < this.flies.length; i++) {
            let direction = new THREE.Vector3();
            this.flies[i].getWorldDirection(direction);
            this.flies[i].position.add(direction.multiplyScalar(this.moveSpeed));
            this.flies[i].rotation.y += (Math.random() * 360 * Math.PI / 180) / 100
            this.flies[i].rotation.z += (Math.random() * 360 * Math.PI / 180) / 100
            this.flies[i].rotation.x += (Math.random() * 360 * Math.PI / 180) / 100
        }

    }



}