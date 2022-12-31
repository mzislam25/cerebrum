let icons = ['user', 'play', 'anchor', 'archive', 'asterisk', 'barcode', 'ban', 'bolt', 'bed', 'battery-full', 'bomb', 'book', 'bus', 'camera', 'clock', 'coffee', 'phone', 'music', 'search', 'ambulance', 'train', 'copyright', 'fire', 'heart', 'home', 'tree', 'star', 'times', 'cogs', 'wrench', 'university', 'trash'];
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
let playgroundWidth=444;
let tileWidth=140;
const initBoard = () => {
    resetBoard();
    document.getElementById("btn_restart").removeAttribute("disabled");
    document.getElementById("playground").classList.remove("d-none");
    size = Number(document.getElementById('size').value);
    getRecord(size);
    if (size >= 3) {
        playgroundWidth = document.getElementById("playground").offsetWidth;
        // console.log(playgroundWidth);
        tileWidth = (playgroundWidth - (8*size)-8) / size;
        if(tileWidth > 140){
            tileWidth = 140;
        }
        // console.log(tileWidth);
        // document.getElementById('board').setAttribute("style", "width:" + playgroundWidth + "px");
        let html = '';
        let counter = 0;
        for (let i = 0; i < (size * size); i++) {
            html += '<button class="tile btn btn-secondary" data="' + counter + '" id="btn_' + i + '" style="width:'+tileWidth+'px; height:'+tileWidth+'px" onclick="checkMatch(' + i + ');"><i id="icon_' + i + '" class="d-none icon fa fa-' + icons[counter] + ' fa-2x"></i></button>';
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
    // console.log(tile, typeof tile);
    const tiles = [...tile];
    // console.log(typeof tiles);
    const arr = shuffleArray(tiles);
    document.getElementById('board').setAttribute("style", "width:" + ((size * tileWidth)+(size * 8)) + "px");
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
    let html = '<p>You take ' + move + ' moves</p>' +
        '<p>Your time ' + document.getElementById('timer').innerText + '</p>' +
        '<p>Rating ' + document.getElementById('rating').innerHTML + '</p>';
    document.getElementById('text').innerHTML = html;
    // postRecord();
    setTimeout(() => {
        document.getElementById("popup").classList.toggle("active");
        // alert('Thank You! You are done in ' + total_time_in_sec + ' secs');
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
    xmlhttp.open("GET", "/record?" + "size=" + size, true);
    xmlhttp.send();
}
const postRecord = () => {
    let user = document.getElementById('form_user').value;
    let params = `size=${size}&userId=${user}&time=${total_time_in_sec}&move=${move}&rating=${rating}`
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/record', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => { console.log('Saved'); };
    xhr.send(params);
}
document.onkeydown = function(e) {
    if(event.keyCode == 123) {
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}