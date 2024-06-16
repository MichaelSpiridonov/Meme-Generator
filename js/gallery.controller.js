'use strict'


function onInit() {
    createImgs()
    renderImgs()
}


function renderImgs() { 
    var imgContainer = document.querySelector('.image-grid')
    const imgs = getImgs()
    imgs.forEach(img => {
        const imgs = document.createElement('img')
        imgs.src = img.url.src
        imgs.onclick = function () {
            onImgClick()
        }
        imgContainer.appendChild(imgs)
    })
}

function displayGallery() {
    var galleryContainer = document.querySelector('.gallery-section')
    var editorContainer = document.querySelector('.editor-section')
    var canvasContainer = document.querySelector('.canvas-section')
    galleryContainer.classList.remove('hidden')
    editorContainer.classList.add('hidden')
    canvasContainer.classList.add('hidden')
}


function onImgClick() {
    console.log('This works!')
    onImgPick()
}

