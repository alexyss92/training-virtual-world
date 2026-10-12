document.querySelectorAll('.target').forEach(function (object) {
    let isColored = false;

    object.addEventListener('click', function () {
        isColored = !isColored;

        const color = isColored ? '#FF9900' : '#000000';
        object.setAttribute('material', 'color', color);

        console.log(object.id, 'Nuovo colore:', color);
    });
});