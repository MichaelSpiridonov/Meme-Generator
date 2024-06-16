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
        imgs.setAttribute('data-id', img.id);
        imgs.onclick = function () {
            onImgClick(this)
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


function onImgClick(img) {
    const imageId = img.getAttribute('data-id')
    createMeme(imageId)
    onImgPick()
}

