'use strict'
let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    createImgs()
    createMeme({
        x: 250,
        y: 50
    })
    renderMeme()
}


function renderMeme() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    console.log('Rendering...')
    renderCanvas()
    addListeners()
}

function renderCanvas() {
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)

    const meme = getMeme()
    const image = getImg(meme.selectedImgId)

    var elInput = document.querySelector('.top-txt')
    elInput.value = meme.lines[0].txt

    gCtx.font = `${meme.lines[0].size}px Arial`
    gCtx.fillStyle = meme.lines[0].color
    gCtx.strokeStyle = meme.lines[0].color
    gCtx.lineWidth = 2
    gCtx.textAlign = 'center'
    
    gCtx.drawImage(image.url, 0, 0, gElCanvas.width, gElCanvas.height)
    gCtx.fillText(meme.lines[0].txt, meme.lines[0].pos.x, meme.lines[0].pos.y)
    gCtx.strokeText(meme.lines[0].txt, meme.lines[0].pos.x, meme.lines[0].pos.y)
    image.url.onload = () => {
        gCtx.drawImage(image.url, 0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.fillText(meme.lines[0].txt, meme.lines[0].pos.x, meme.lines[0].pos.y)
        gCtx.strokeText(meme.lines[0].txt, meme.lines[0].pos.x, meme.lines[0].pos.y)
    }

}

// function renderText(meme) {

// }

function drawText(text, offsetX, offsetY) {
    gCtx.font = '40px Arial'
    gCtx.fillStyle = 'white'
    gCtx.lineWidth = 2
    gCtx.textAlign = 'center'

    gCtx.fillText(text, offsetX, offsetY)
    gCtx.strokeText(text, offsetX, offsetY)
}

function setLineTxt(text) {
    let meme = getMeme()
    meme.lines[0].txt = text.value
    renderCanvas()
}


function addText() {
    gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height)
    const topText = document.querySelector('.top-txt').value
    const bottomText = document.querySelector('.bottom-txt').value

    if (topText) {
        drawText(topText, gElCanvas.width / 2, 50)
    }
    if (bottomText) {
        drawText(bottomText, gElCanvas.width / 2, gElCanvas.height - 20)
    }
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
    console.log('Does this work now?')
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const {isDrag} = getMeme().lines[0]
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
    renderCanvas()
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