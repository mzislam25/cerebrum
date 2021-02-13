let icons = ['user', 'play', 'anchor', 'archive', 'asterisk', 'barcode', 'ban', 'bolt', 'bed', 'battery-full', 'bomb', 'book', 'bus', 'camera', 'clock', 'coffee'];
let size = 0;
const initBoard = (elem) => {
    document.getElementById("btn_restart").removeAttribute("disabled");
    size = Number(document.getElementById(elem.id).value);
    if (size >= 3) {
        document.getElementById('board').setAttribute("style", "width:" + size * 162+"px");
        let html = '';
        let counter = 0;
        for (let i = 0; i < (size * size); i++) {
            html += '<button class="tile btn btn-secondary" data="' + counter + '" id="show_' + i + '" onclick="showIcon(' + i + ');"><i id="icon_' + i + '" class="d-none icon fa fa-' + icons[counter] + ' fa-2x"></i></button>';
            if (counter < ((size * size) / 2) - 1) {
                counter++;
            } else {
                counter = 0;
            }
        }
        document.getElementById("board").innerHTML = html;
        startGame();
    }
}
const startGame = () => {
    const tile = document.getElementsByClassName("tile");
    const tiles = [...tile];
    const arr = shuffleArray(tiles);
    document.getElementById('board').setAttribute("style", "width:" + size * 162+"px");
    let board=document.querySelector('#board');
    for (let i = 0; i < tiles.length; i++) {
        let html = document.querySelector('#'+arr[i].id);
        board.appendChild(html);
    }
}
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
