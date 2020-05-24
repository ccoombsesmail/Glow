import * as THREE from 'three';
import * as Utils from '../utils'

export class FireFlies {

    constructor(scene) {
        let geometry = new THREE.SphereGeometry(.4);
        let material = new THREE.MeshLambertMaterial({ color: 0xE74E0D });
        this.flies = []
        this.scene = scene
        this.moveSpeed = .1
        for (let i = 0; i < 55; i++) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x =  (Math.random() - 0.5) * 475;
            mesh.position.y = 40+ (Math.random() - 0.5) * 75;
            mesh.position.z = (Math.random() - 0.5) * 475;
            // var light = new THREE.PointLight(0xE74E0D, 1, 50);
            // light.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
            // this.scene.add(light);
            mesh.layers.enable(1)
            this.scene.add(mesh);
            this.flies.push(mesh)
            this.pulseUp = this.pulseUp.bind(this)
            this.pulseDown = this.pulseDown.bind(this)
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

    checkCollision(player, bloomPass, light) {

        for (let i = 0; i < this.flies.length; i++) {
            if (Utils.distance(this.flies[i], player) < 3) {
                this.scene.remove(this.flies[i])
                this.flies.splice(i,1)
                this.pulseUp(bloomPass, light)
                // bloomPass.strength += .3
                // light.power += 20
            }
        }

    }

    pulseUp(bloomPass, light) {
        let i = 0;
        const pulseInt = setInterval(() => {
            bloomPass.strength += .02
            light.power += .44
            light.distance  += .5
            i += 1
            if (i === 46) {
                clearInterval(pulseInt)
                this.pulseDown(bloomPass, light)
            }

        })
    }

    pulseDown(bloomPass, light) {
        let i = 46;
        const pulseInt = setInterval(() => {
            bloomPass.strength -= .02
            light.power -= .44
            light.distance -= .5
            i -= 1
            if (i === 14) {
                clearInterval(pulseInt)
            }

        })
    }

}
