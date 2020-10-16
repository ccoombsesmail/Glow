import * as THREE from 'three';

function initMusic(camera) {
    let listener = new THREE.AudioListener();
    camera.add(listener);
    let audioLoader = new THREE.AudioLoader();
    audioLoader.setCrossOrigin('anonymous')
    var music = new THREE.Audio(listener);
    audioLoader.load('/src/audio/song.mp3', (buffer) => {

        music.setBuffer(buffer);
        music.setLoop(true);
        music.setVolume(0.5);
        music.play();

        document.getElementById('volume').addEventListener('click', () => {
            if (music.isPlaying) {
                music.pause()
            } else {
                music.play()
            }
        })
    });
}

export {initMusic}