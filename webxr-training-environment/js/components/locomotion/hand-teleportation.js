
"use strict";

AFRAME.registerComponent("hand-teleportation", {
    schema: {
        margin: { default: 0.5 }
    },

    init: function () {
        this.rig = document.querySelector("#camera-rig");
        this.camera = document.querySelector("#camera-rig a-camera");

        // Vettori utilizzati per calcolare il puntamento
        this.origin = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.target = new THREE.Vector3();
        this.headPosition = new THREE.Vector3();

        // Ultima destinazione valida
        this.lastValidTarget = new THREE.Vector3();
        this.lastValidTime = 0;

        // Indicatore della destinazione
        this.marker = document.createElement("a-ring");

        this.marker.setAttribute("radius-inner", 0.13);
        this.marker.setAttribute("radius-outer", 0.18);
        this.marker.setAttribute("rotation", "-90 0 0");
        this.marker.setAttribute(
            "material",
            "shader: flat; color: #2563EB; side: double"
        );

        this.marker.object3D.position.y = 0.05;
        this.marker.object3D.visible = false;

        this.el.sceneEl.appendChild(this.marker);

        // Teletrasporto tramite pinch della mano destra
        this.onPinch = this.teleport.bind(this);
        this.el.addEventListener("pinchstarted", this.onPinch);
    },

    hideMarker: function () {
        this.marker.object3D.visible = false;
    },

    tick: function () {
        const xr = this.el.sceneEl.renderer?.xr;

        if (!xr) {
            this.hideMarker();
            return;
        }

        const session = xr.getSession();
        const frame = xr.getFrame();
        const referenceSpace = xr.getReferenceSpace();

        if (!session || !frame || !referenceSpace || !this.rig) {
            this.hideMarker();
            return;
        }

        // Individua la mano destra
        const rightHand = Array.from(session.inputSources).find(
            source =>
                source.handedness === "right" &&
                source.hand
        );

        if (!rightHand) {
            this.hideMarker();
            return;
        }

        // Articolazioni dell'indice
        const baseSpace = rightHand.hand.get(
            "index-finger-phalanx-proximal"
        );

        const tipSpace = rightHand.hand.get(
            "index-finger-tip"
        );

        if (!baseSpace || !tipSpace) {
            this.hideMarker();
            return;
        }

        const basePose = frame.getJointPose(
            baseSpace,
            referenceSpace
        );

        const tipPose = frame.getJointPose(
            tipSpace,
            referenceSpace
        );

        if (!basePose || !tipPose) {
            this.hideMarker();
            return;
        }

        // Posizioni delle articolazioni nello spazio WebXR
        const base = basePose.transform.position;
        const tip = tipPose.transform.position;

        const basePosition = new THREE.Vector3(
            base.x,
            base.y,
            base.z
        );

        const tipPosition = new THREE.Vector3(
            tip.x,
            tip.y,
            tip.z
        );

        // Conversione nelle coordinate della scena
        this.rig.object3D.updateMatrixWorld(true);

        this.rig.object3D.localToWorld(basePosition);
        this.rig.object3D.localToWorld(tipPosition);

        // Raggio dalla base dell'indice verso la punta
        this.origin.copy(tipPosition);

        this.direction
            .subVectors(tipPosition, basePosition)
            .normalize();

        // Il dito deve puntare verso il pavimento
        if (this.direction.y >= -0.05) {
            this.hideMarker();
            return;
        }

        // Intersezione con il pavimento (y = 0)
        const distance = -this.origin.y / this.direction.y;

        if (distance <= 0 || distance > 10) {
            this.hideMarker();
            return;
        }

        this.target
            .copy(this.origin)
            .addScaledVector(this.direction, distance);

        // Controllo dei limiti della stanza
        const margin = this.data.margin;

        const targetValid =
            this.target.x >= -5 + margin &&
            this.target.x <= 5 - margin &&
            this.target.z >= -10 + margin &&
            this.target.z <= -margin;

        if (!targetValid) {
            this.hideMarker();
            return;
        }

        // Memorizza la destinazione
        this.lastValidTarget.copy(this.target);
        this.lastValidTime = performance.now();

        // Aggiorna la posizione del cerchio
        this.marker.object3D.position.set(
            this.target.x,
            0.05,
            this.target.z
        );

        this.marker.object3D.visible = true;
    },

    teleport: function () {
        if (!this.rig || !this.camera || this.lastValidTime === 0) {
            return;
        }

        // Posizione attuale della testa
        this.camera.object3D.updateWorldMatrix(true, false);
        this.camera.object3D.getWorldPosition(this.headPosition);

        // Destinazione selezionata
        const destination = this.lastValidTarget;

        // Spostamento necessario sugli assi X e Z
        const deltaX = destination.x - this.headPosition.x;
        const deltaZ = destination.z - this.headPosition.z;

        // Sposta il camera-rig
        this.rig.object3D.position.x += deltaX;
        this.rig.object3D.position.z += deltaZ;

        this.rig.object3D.updateMatrixWorld(true);

        // Nasconde l'indicatore dopo il teletrasporto
        this.hideMarker();
    },

    remove: function () {
        this.el.removeEventListener("pinchstarted", this.onPinch);

        if (this.marker?.parentNode) {
            this.marker.parentNode.removeChild(this.marker);
        }
    }
});
