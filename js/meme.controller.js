'use strict'
let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onImgPick() {
    createMeme()
    renderMeme()
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

    if (meme.lines.length) {
        var elInput = document.querySelector('.top-txt')
        elInput.value = meme.lines[meme.selectedLineIdx].txt
        renderImgComponents(image)
        renderTextComponents(meme.lines[meme.selectedLineIdx], image)
    } else {
        renderImgComponents(image)
    }
    image.url.onload = () => {
        renderImgComponents(image)
        renderTextComponents(meme.lines[meme.selectedLineIdx], image)
    }
}

function renderTextComponents(meme) {
    gCtx.font = `${meme.size}px Arial`
    gCtx.fillStyle = meme.color
    gCtx.strokeStyle = meme.color
    gCtx.lineWidth = 2
    var textWidth = gCtx.measureText(meme.txt).width;
    // var lineHeight = meme.size * 1.8642
    //gCtx.textAlign = 'center'
    const padding = 1
    const totalWidth = textWidth + padding * 2
    const totalHeight = meme.size + padding * 2
    //gCtx.strokeRect(meme.pos.x - 180, meme.pos.y - 37, textWidth, lineHeight)
    gCtx.strokeRect(meme.pos.x, meme.pos.y, totalWidth - padding * 3, totalHeight - padding * 2)
    gCtx.fillText(meme.txt, meme.pos.x, meme.pos.y)
    gCtx.strokeText(meme.txt, meme.pos.x, meme.pos.y)
}

function renderImgComponents(image) {
    gCtx.drawImage(image.url, 0, 0, gElCanvas.width, gElCanvas.height)
}

// function drawText(text, offsetX, offsetY) {
//     // gCtx.font = '40px Arial'
//     // gCtx.fillStyle = 'white'
//     // gCtx.lineWidth = 2

//     //var textWidth = gCtx.measureText(text).width;


//     const borderColor = 'red';
//     const textColor = 'black';
//     const textMetrics = gCtx.measureText(text);
//     const textWidth = textMetrics.width;
//     const textHeight = fontSize;


//     // gCtx.strokeRect(offsetX, offsetY, textWidth, lineHeight)
//     // gCtx.fillText(text, offsetX, offsetY)
//     // gCtx.fillText(text, padding + padding / 2, padding + textHeight)
//     //gCtx.strokeText(text, offsetX, offsetY)
//     // gCtx.strokeRect(offsetX, offsetY, textWidth, lineHeight)
// }

function setLineTxt(text) {
    let meme = getMeme().lines[getMeme().selectedLineIdx]
    meme.txt = text.value
    renderCanvas()
}


function addText() {

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
    } = getMeme().lines[0]
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


// Button Functionality.

function setTxtColor(color) {
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].color = color.value
    renderCanvas()
}

function setTextBorder(text) {
    
}

function setFontSize(size, toIncrease) {
    const meme = getMeme()
    if (toIncrease) meme.lines[meme.selectedLineIdx].size += size
    else meme.lines[meme.selectedLineIdx].size -= size
    renderCanvas()
}

function deleteText() {
    const meme = getMeme()
    meme.lines.pop()
    const topText = document.querySelector('.top-txt')
    topText.remove()
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
