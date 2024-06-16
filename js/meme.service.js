'use strict'

var gId = 1
var gImgs = []
var gMeme
var gKeywordSearchCountMap = {
    'funny': 12,
    'cat': 16,
    'baby': 2
}

function createMeme(imageId) {
    gMeme = {
        selectedImgId: +imageId,
        selectedLineIdx: 0,
        lines: [{
            pos: {
                x: 250,
                y: 50
            },
            txt: 'Add Text Here',
            size: 24,
            color: 'white',
            isDrag: false,
        }, 
        {
            pos: {
                x: 250,
                y: 480
            },
            txt: 'Add Text Here',
            size: 24,
            color: 'white',
            isDrag: false,
        }]
    }
}

function createLine() {
    return {
        pos: {
            x: 250,
            y: 100
        },
        txt: 'Add Text Here',
        size: 24,
        color: 'white',
        isDrag: false,
    }
}

function getMeme() {
    return gMeme
}

function isTextClicked(clickedPos) {
    const { pos } = gMeme.lines[gMeme.selectedLineIdx]
    return (clickedPos.x >= pos.x && clickedPos.x <= pos.x + 250 && clickedPos.y >= pos.y - 500 && clickedPos.y <= pos.y);
}

function setTextDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}