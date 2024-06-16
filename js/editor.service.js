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

function createLine(pos=50, text='Add Text Here') {
    return {
        pos: {
            x: 250,
            y: pos + 30
        },
        txt: text,
        size: 24,
        color: 'white',
        isDrag: false,
    }
}

function getMeme() {
    return gMeme
}

function isTextClicked(clickedPos, textWidth) {
    const { pos } = gMeme.lines[gMeme.selectedLineIdx]
    return clickedPos.x >= pos.x - textWidth && clickedPos.x <= pos.x + textWidth && clickedPos.y >= pos.y - 10 && clickedPos.y<= pos.y + 10
}

function setTextDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}