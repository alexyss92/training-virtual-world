
"use strict";

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
