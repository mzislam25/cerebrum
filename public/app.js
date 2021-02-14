let icons = ['user', 'play', 'anchor', 'archive', 'asterisk', 'barcode', 'ban', 'bolt', 'bed', 'battery-full', 'bomb', 'book', 'bus', 'camera', 'clock', 'coffee'];
let size = 0;
let opened = [];
let move = 0;
let done = 0;
const initBoard = (elem) => {
    document.getElementById("btn_restart").removeAttribute("disabled");
    size = Number(document.getElementById(elem.id).value);
    if (size >= 3) {
        document.getElementById('board').setAttribute("style", "width:" + size * 162 + "px");
        let html = '';
        let counter = 0;
        for (let i = 0; i < (size * size); i++) {
            html += '<button class="tile btn btn-secondary" data="' + counter + '" id="btn_' + i + '" onclick="checkMatch(' + i + ');"><i id="icon_' + i + '" class="d-none icon fa fa-' + icons[counter] + ' fa-2x"></i></button>';
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
    document.getElementById('board').setAttribute("style", "width:" + size * 162 + "px");
    let board = document.querySelector('#board');
    for (let i = 0; i < tiles.length; i++) {
        let html = document.querySelector('#' + arr[i].id);
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

const checkMatch = (i) => {
    document.getElementById('icon_' + i).classList.remove('d-none');
    document.getElementById('btn_' + i).classList.remove('btn-secondary');
    document.getElementById('btn_' + i).classList.add('btn-info');
    document.getElementById('btn_' + i).setAttribute('disabled', 'disabled');
    const data = document.getElementById('btn_' + i).getAttribute('data');
    opened.push({ id: i, data });
    if (opened.length === 2) {
        move++;
        document.getElementById('move').innerText = move;
        if (opened[0].data === opened[1].data) {
            showSuccess(opened);
            opened = [];
            done++;
            if (done === parseInt(size * size / 2)) {
                endGame();
            }
        } else {
            showError(opened);
            opened = [];
        }
    }
}

const showSuccess = (arr) => {
    arr.forEach(element => {
        document.getElementById('icon_' + element.id).classList.remove('d-none');
        document.getElementById('btn_' + element.id).classList.remove('btn-secondary');
        document.getElementById('btn_' + element.id).classList.remove('btn-info');
        setTimeout(() => {
            document.getElementById('btn_' + element.id).classList.add('btn-success');
            document.getElementById('btn_' + element.id).setAttribute('disabled', 'disabled');
        }, 100);
    });
}
const showError = (arr) => {
    arr.forEach(element => {
        document.getElementById('icon_' + element.id).classList.remove('d-none');
        document.getElementById('btn_' + element.id).classList.remove('btn-secondary');
        document.getElementById('btn_' + element.id).classList.add('btn-danger');
        setTimeout(() => {
            document.getElementById('btn_' + element.id).classList.remove('btn-info');
            document.getElementById('btn_' + element.id).classList.remove('btn-danger');
            document.getElementById('icon_' + element.id).classList.add('d-none');
            document.getElementById('btn_' + element.id).classList.add('btn-secondary');
            document.getElementById('btn_' + element.id).removeAttribute('disabled');
        }, 1000);
    });
}
const endGame = () => {
    setTimeout(()=>{
        alert('Thank You! You are done');
    },1000)
}