'use strict'

var gId = 1
var gImgs = []
var gMeme
var gKeywordSearchCountMap = {
    'funny': 12,
    'cat': 16,
    'baby': 2
}

function createMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            pos: {
                x: 250,
                y: 50
            },
            txt: 'I sometimes eat Falafel',
            size: 30,
            color: 'white',
            isDrag: false,
        }]
    }
}

function getMeme() {
    return gMeme
}


function isTextClicked(clickedPos) {
    const {
        pos
    } = gMeme.lines[0]
    return (clickedPos.x >= pos.x && clickedPos.x <= pos.x + 250 && clickedPos.y >= pos.y - 500 && clickedPos.y <= pos.y);
}

function setTextDrag(isDrag) {
    gMeme.lines[0].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}