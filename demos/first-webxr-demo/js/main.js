const targets = document.querySelectorAll('.target');

const controllerColors = {
    'left-controller': '#00CCFF',
    'right-controller': '#FF55AA'
};

targets.forEach(function (target) {
    target.setAttribute('material', 'color', 'black');

    target.addEventListener('click', function (event) {
        const cursor = event.detail.cursorEl;

        if (!cursor) return;

        let color;

        if (cursor.id === 'left-controller'
            || cursor.id === 'right-controller') {
            color = controllerColors[cursor.id];
        } else if (cursor === document.querySelector('a-scene')) {
            // Il cursore del mouse è configurato sulla scena
            color = '#FF8800';
        }

        if (color) {
            target.setAttribute('material', 'color', color);
        }
    });
});