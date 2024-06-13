'use strict'

// var gImgs = [{
//     id: 1,
//     url: 'img/1.jpg',
//     keywords: ['funny', 'cat']
// }]
// ^^ As refrence

// var gMeme = {
//     selectedImgId: 5,
//     selectedLineIdx: 0,
//     lines: [{
//         txt: 'I sometimes eat Falafel',
//         size: 20,
//         color: 'red'
//     }]
// }
// ^^ As refrence

// var gKeywordSearchCountMap = {
//     'funny': 12,
//     'cat': 16,
//     'baby': 2
// }
// ^^ As refrence
var gId = 1
var gImgs = []
var gMeme
var gKeywordSearchCountMap

function createImgs() {
    for (var i = 0; i < 18; i++) {
        gImgs.push(_createImg())
    }
}

function _createImg() {
    let image = new Image()
    image.src = `img/${gId}.jpg`
    return {
        url: image,
        id: gId++,
        keywords: ['funny', 'cat']
    }
}

function createMeme(pos) {
    gMeme ={
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            pos,
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

function getImg(id) {
    return gImgs.find(img => img.id === id)
}

function isTextClicked(clickedPos) {
    const { pos } = gMeme.lines[0]
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= gMeme.size
}

function setTextDrag(isDrag) {
    gMeme.lines[0].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.pos.x += dx
    gMeme.pos.y += dy
}
