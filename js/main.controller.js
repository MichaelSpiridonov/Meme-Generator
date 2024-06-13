'use strict'
let gElCanvas
let gCtx

function onInit() {
    createImgs()
    renderMeme()
}


function renderMeme() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    console.log('Rendering...')
    renderCanvas()
}

function renderCanvas() {
    const meme = getMeme()
    const image = getImg(meme.selectedImgId)
    console.log(meme)
    gCtx.font = `${meme.lines[0].size}px Arial`
    gCtx.fillStyle = meme.lines[0].color
    gCtx.strokeStyle = meme.lines[0].color
    gCtx.lineWidth = 2
    gCtx.textAlign = 'center'
    image.url.onload = () => {
        gCtx.drawImage(image.url, 0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.fillText(meme.lines[0].txt, gElCanvas.width / 2, 50)
        gCtx.strokeText(meme.lines[0].txt, gElCanvas.width / 2, 50)
    }

}

// function drawText(text, offsetX, offsetY) {
//     gCtx.font = '40px Arial'
//     gCtx.fillStyle = 'white'
//     gCtx.lineWidth = 2
//     gCtx.textAlign = 'center'

//     gCtx.fillText(text, offsetX, offsetY)
//     gCtx.strokeText(text, offsetX, offsetY)
// }


// function addText() {
//     gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height)
//     const topText = document.querySelector('.top-txt').value
//     const bottomText = document.querySelector('.bottom-txt').value

//     if (topText) {
//         drawText(topText, gElCanvas.width / 2, 50)
//     }
//     if (bottomText) {
//         drawText(bottomText, gElCanvas.width / 2, gElCanvas.height - 20)
//     }
// }



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