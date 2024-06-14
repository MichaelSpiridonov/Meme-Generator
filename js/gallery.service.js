'use strict'



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

function getImgs() {
    return gImgs
}

function getImg(id) {
    return gImgs.find(img => img.id === id)
}