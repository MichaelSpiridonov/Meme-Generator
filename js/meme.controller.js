'use strict'
let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onImgPick() {
    renderMeme()
    displayEditor()
}

function renderMeme() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gCtx.textAlign = 'center'

    console.log('Rendering...')
    renderCanvas()
    addListeners()
}

function renderCanvas() {
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)

    const meme = getMeme()
    const image = getImg(meme.selectedImgId)
    renderImgComponents(image)
    meme.lines.forEach(meme => {
        renderTextComponents(meme.txt, meme.size, meme.color, meme.pos.x, meme.pos.y)
    });

}

function renderTextComponents(txt, size, color, offsetX, offsetY) {
    gCtx.font = `${size}px Arial`
    gCtx.fillStyle = color
    gCtx.strokeStyle = color
    gCtx.lineWidth = 2
    gCtx.textAlign = 'center';
    gCtx.fillText(txt, offsetX, offsetY)
    gCtx.strokeText(txt, offsetX, offsetY)
    setTextBorder()
}

function renderImgComponents(image) {
    gCtx.drawImage(image.url, 0, 0, gElCanvas.width, gElCanvas.height)
}

function setTextBorder() {
    const meme = getMeme().lines[getMeme().selectedLineIdx]
    var textWidth = gCtx.measureText(meme.txt).width;

    const padding = 2;
    const totalWidth = textWidth + padding * 2;
    const totalHeight = meme.size + padding * 2;

    const offsetX_centered = meme.pos.x - totalWidth / 2;
    const offsetY_centered = meme.pos.y - totalHeight / 2;

    gCtx.strokeRect(offsetX_centered - 7, offsetY_centered -7, totalWidth + 15, totalHeight + 2)
}

function setLineTxt(text) {
    let meme = getMeme().lines[getMeme().selectedLineIdx]
    meme.txt = text.value
    var input = document.querySelector('.text-input')
    input.value = text.value
    renderCanvas()
}

function downloadCanvas() {
    const dataUrl = gElCanvas.toDataURL()
    const link = document.createElement('a');

    link.href = dataUrl;
    link.download = 'meme-image.png'; // Set your desired filename
    link.click();
}

function shareToFacebook() {
    // Gets the image from the canvas
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)

    // Upload the image to a server, get back a URL 
    // call the function onSuccess when done
    function doUploadImg(imgDataUrl, onSuccess) {
        // Pack the image for delivery
        const formData = new FormData()
        formData.append('img', imgDataUrl)

        // Send a post req with the image to the server
        const XHR = new XMLHttpRequest()
        XHR.onreadystatechange = () => {
            // If the request is not done, we have no business here yet, so return
            if (XHR.readyState !== XMLHttpRequest.DONE) return
            // if the response is not ok, show an error
            if (XHR.status !== 200) return console.error('Error uploading image')
            const {
                responseText: url
            } = XHR
            // Same as
            // const url = XHR.responseText

            // If the response is ok, call the onSuccess callback function, 
            // that will create the link to facebook using the url we got
            console.log('Got back live url:', url)
            onSuccess(url)
        }
        XHR.onerror = (req, ev) => {
            console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
        }
        XHR.open('POST', '//ca-upload.com/here/upload.php')
        XHR.send(formData)
    }
}



// Movmenet

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isTextClicked(pos)) return
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    if (!getMeme().lines[getMeme().selectedLineIdx]) return;
    const {
        isDrag
    } = getMeme().lines[getMeme().selectedLineIdx]
    if (!isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveText(dx, dy)
    gStartPos = pos
    renderCanvas()
}

function onUp() {
    setTextDrag(false)
    document.body.style.cursor = 'grab'
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}


function getEvPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}


// Button Functionality.

function addText() {
    const meme = getMeme()
    const newLine = createLine()
    meme.lines.push(newLine)
    meme.selectedLineIdx = meme.lines.length - 1
    setTextBorder(newLine.txt, newLine.size, newLine.pos.x, newLine.pos.y)
    renderCanvas()
}

function setTxtColor(color) {
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].color = color.value
    renderCanvas()
}

function setFontSize(size, toIncrease) {
    const meme = getMeme()
    if (toIncrease) meme.lines[meme.selectedLineIdx].size += size
    else meme.lines[meme.selectedLineIdx].size -= size
    renderCanvas()
}

function deleteText() {
    const meme = getMeme()
    meme.lines.splice(meme.lines[meme.selectedLineIdx], 1)
    renderCanvas()
}

function setFontDirection(direction) {
    switch (direction) {
        case ('center'):
            gCtx.textAlign = "center"
            break;
        case ('left'):
            gCtx.textAlign = "left"
            break;
        case ('right'):
            gCtx.textAlign = "right"
            break;

    }
}

function switchToNextText() {
    const meme = getMeme()
    console.log(meme)
    var nextIdx = meme.selectedLineIdx + 1
    if(nextIdx > meme.lines.length -1) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
    renderCanvas()
    setTextInput()
}

// DOM Stuff
function displayEditor() {
    var galleryContainer = document.querySelector('.gallery-section')
    var editorContainer = document.querySelector('.editor-section')
    var canvasContainer = document.querySelector('.canvas-section')
    galleryContainer.classList.add('hidden')
    editorContainer.classList.remove('hidden')
    editorContainer.classList.remove('hidden')
    canvasContainer.classList.remove('hidden')
}


function setTextInput() {
    const meme = getMeme().lines[getMeme().selectedLineIdx]
    var input = document.querySelector('.text-input')
    input.value = meme.txt
}


