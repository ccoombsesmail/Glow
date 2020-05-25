import * as THREE from 'three';
import * as Utils from '../utils'

export class FireFlies {

    constructor(scene) {
        let geometry = new THREE.SphereGeometry(.4);
        let material = new THREE.MeshLambertMaterial({ color: 0xE74E0D });
        this.flies = []
        this.caught = []
        this.scene = scene
        this.moveSpeed = .1
        this.inner = document.getElementsByClassName('progress-inner')[0]
        for (let i = 0; i < 55; i++) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x =  (Math.random() - 0.5) * 475;
            mesh.position.y = 40 + (Math.random() - 0.5) * 75;
            mesh.position.z = (Math.random() - 0.5) * 475;
            mesh.layers.enable(1)
            this.scene.add(mesh);
            this.flies.push(mesh)
            this.pulseUp = this.pulseUp.bind(this)
            this.pulseDown = this.pulseDown.bind(this)
            this.absorbAnimation = this.absorbAnimation.bind(this)
            this.addProgress = this.addProgress.bind(this)
        }
    }


    moveFlies() {

        for (let i = 0; i < this.flies.length; i++) {
            let direction = new THREE.Vector3();
            this.flies[i].getWorldDirection(direction);
            this.flies[i].position.add(direction.multiplyScalar(this.moveSpeed));
            if (this.flies[i].position.y < 0) {
                this.flies[i].rotation.y = 30 * Math.PI / 180
            }else {
                this.flies[i].rotation.y += (Math.random() * 360 * Math.PI / 180) / 100
            }
    
            this.flies[i].rotation.z += (Math.random() * 360 * Math.PI / 180) / 100
            this.flies[i].rotation.x += (Math.random() * 360 * Math.PI / 180) / 100
        }

    }

    checkCollision(player) {

        for (let i = 0; i < this.flies.length; i++) {
            if (Utils.distance(this.flies[i], player) < 30) {
                // this.scene.remove(this.flies[i])
                this.caught.push(this.flies[i])
                this.flies.splice(i,1)
                // bloomPass.strength += .3
                // light.power += 20
              
            }
        }

    }

    absorbAnimation(player, bloomPass, light) {

        let playerDir = new THREE.Vector3()
        player.getWorldDirection(playerDir)
        for (let i = 0; i < this.caught.length; i++) {
            // let flyDir = new THREE.Vector3()
            // this.caught[i].getWorldDirection(flyDir)
            // // console.log(flyDir)
            // flyDir.lerpVectors(flyDir, playerDir)
            // console.log(flyDir)
            // this.caught[i].rotation.y += (Math.random() - .5)
            // this.caught[i].rotation.z += (Math.random() - .5) 
            // this.caught[i].rotation.x += (Math.random() - .5) 
            // let direction = new THREE.Vector3();
            // this.caught[i].getWorldDirection(direction);
            // this.caught[i].position.add(direction.multiplyScalar(.2));
            // setTimeout( () => {

            this.caught[i].lookAt(player.position.x, player.position.y, player.position.z)
            this.caught[i].rotation.y += .2
            this.caught[i].rotation.z += .2
            this.caught[i].rotation.x += .2
            let flyDir = new THREE.Vector3()
            this.caught[i].getWorldDirection(flyDir)
            this.caught[i].position.add(flyDir.multiplyScalar(.4));
            if (Utils.distance(this.caught[i], player) < 1) {
                this.scene.remove(this.caught[i])
                this.caught.splice(i, 1)
                this.pulseUp(bloomPass, light)
                // let inner = document.getElementsByClassName('progress-inner')[0]
                // inner.style.width = (Number(inner.style.width.slice(0, inner.style.width.length-1)) + (1/55)*100).toString() + '%'
                this.addProgress()
            } 

        // }, 400)
        }

        // this.scene.remove(this.flies[i])

    }

    addProgress(){
        let i = 0
        const progressInt = setInterval(() => {
            this.inner.style.width = (Number(this.inner.style.width.slice(0, this.inner.style.width.length - 1)) + (1 / 1375) * 100).toString() + '%'
            i += 1
            if (i === 25) {
                clearInterval(progressInt)
            }    
        }, 60)


    }

    pulseUp(bloomPass, light) {
        let i = 0;
        const pulseInt = setInterval(() => {
            bloomPass.strength += .07
            light.power += .84
            light.distance  += .7
            i += 1
            if (i === 46) {
                clearInterval(pulseInt)
                this.pulseDown(bloomPass, light)
            }

        }, 30)
    }

    pulseDown(bloomPass, light) {
        let i = 46;
        const pulseInt = setInterval(() => {
            bloomPass.strength -= .07
            light.power -= .84
            light.distance -= .5
            i -= 1
            if (i === 4) {
                clearInterval(pulseInt)
            }

        }, 30)
    }

}
