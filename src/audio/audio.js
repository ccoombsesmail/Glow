import * as THREE from 'three';

function initMusic(camera) {
    var listener = new THREE.AudioListener();
    camera.add(listener);

    var audioLoader = new THREE.AudioLoader();
    audioLoader.setCrossOrigin('anonymous')
    var music = new THREE.Audio(listener);
    audioLoader.load('/src/audio/song.mp3', function (buffer) {

        music.setBuffer(buffer);
        music.setLoop(true);
        music.setVolume(0.5);
        music.play();

    });


}

export {initMusic}