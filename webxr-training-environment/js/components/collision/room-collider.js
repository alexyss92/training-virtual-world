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