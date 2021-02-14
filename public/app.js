let icons = ['user', 'play', 'anchor', 'archive', 'asterisk', 'barcode', 'ban', 'bolt', 'bed', 'battery-full', 'bomb', 'book', 'bus', 'camera', 'clock', 'coffee'];
let size = 0;
let opened = [];
let move = 0;
let done = 0;
let click = 0;
let rating = 3;
//timer variables
let total_time_in_sec = 0;
let second = 0, minute = 0; hour = 0;
let interval;
const initBoard = () => {
    resetBoard();
    document.getElementById("btn_restart").removeAttribute("disabled");
    size = Number(document.getElementById('size').value);
    getRecord(size);
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
    click++;
    if (click === 1) { startTimer(); }
    document.getElementById('icon_' + i).classList.remove('d-none');
    document.getElementById('btn_' + i).classList.remove('btn-secondary');
    document.getElementById('btn_' + i).classList.add('btn-info');
    document.getElementById('btn_' + i).setAttribute('disabled', 'disabled');
    const data = document.getElementById('btn_' + i).getAttribute('data');
    opened.push({ id: i, data });
    if (opened.length === 2) {
        move++;
        document.getElementById('move').innerText = move;
        countRating();
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
    clearInterval(interval);
    document.getElementById('form_time').value = total_time_in_sec;
    document.getElementById('form_move').value = move;
    document.getElementById('form_rating').value = rating;
    setTimeout(() => {
        alert('Thank You! You are done in ' + total_time_in_sec + ' secs');
        document.getElementById('form_record').submit();
    }, 1000);
}

const resetBoard = () => {
    opened = [], move = 0, done = 0, click = 0; rating = 3;
    clearInterval(interval);
    second = 0, minute = 0; hour = 0;
    total_time_in_sec = 0;
    document.getElementById('timer').innerText = minute + " mins " + second + " secs";
    document.getElementById('move').innerText = move;
    document.getElementById('rating').innerHTML = '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
}
const startTimer = () => {
    interval = setInterval(() => {
        total_time_in_sec++;
        second++;
        if (second === 60) {
            minute++;
            second = 0;
        }
        if (minute === 60) {
            hour++;
            minute = 0;
        }
        document.getElementById('timer').innerText = ((hour > 0) ? hour + " hour" : "") + minute + " mins " + second + " secs";
    }, 1000);
}

const countRating = () => {
    if (move <= (size * size) / 2) {
        rating = 3;
        document.getElementById('rating').innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
    } else if (move <= (size * size)) {
        rating = 2;
        document.getElementById('rating').innerHTML = '<i class="fa fa-star"><i class="fa fa-star"></i><i class="far fa-star"></i>';
    } else {
        rating = 1;
        document.getElementById('rating').innerHTML = '<i class="fa fa-star"><i class="far fa-star"><i class="far fa-star"></i>';
    }
}

const getRecord = (size) => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById('record').innerText = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/record?"+"size="+size, true);
    xmlhttp.send();
}