
"use strict";

AFRAME.registerComponent('room-collider', {
    schema: {
        radius: { default: 0.3 }
    },

    tick: function () {
        const rig = this.el;
        const camera = rig.querySelector('[camera]');

        if (!camera) return;

        const rigPosition = rig.object3D.position;
        const cameraPosition = new THREE.Vector3();

        camera.object3D.getWorldPosition(cameraPosition);

        const radius = this.data.radius;

        // Limiti della stanza
        const minX = -5 + radius;
        const maxX = 5 - radius;
        const minZ = -10 + radius;
        const maxZ = 0 - radius;

        // Posizione della testa rispetto al rig
        const offsetX = cameraPosition.x - rigPosition.x;
        const offsetZ = cameraPosition.z - rigPosition.z;

        // Limiti applicati al rig
        rigPosition.x = THREE.MathUtils.clamp(
            rigPosition.x,
            minX - offsetX,
            maxX - offsetX
        );

        rigPosition.z = THREE.MathUtils.clamp(
            rigPosition.z,
            minZ - offsetZ,
            maxZ - offsetZ
        );
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");
    const exitButton = document.getElementById("exit-button");
    const startIntro = document.getElementById("start-intro");

    if (!scene) {
        console.error("Scena A-Frame non trovata.");
        return;
    }

    // Pulsante di uscita
    if (exitButton) {
        exitButton.addEventListener("click", async () => {
            if (scene.is("vr-mode")) {
                await scene.exitVR();
            } else {
                window.location.href =
                    "https://upraisemoodle.dti.supsi.ch/course/view.php?id=5";
            }
        });
    }

    // Pulsante di avvio della lezione
    if (startIntro) {
        console.log("Pulsante INIZIA trovato.");

        startIntro.addEventListener("click", () => {
            console.log("Lezione WebXR avviata!");

            const title = document.querySelector(
                "#intro-station a-text"
            );

            if (title) {
                title.setAttribute(
                    "value",
                    "INTRODUZIONE AL WEBXR"
                );
            }
        });
    } else {
        console.error("Pulsante INIZIA non trovato.");
    }

});
