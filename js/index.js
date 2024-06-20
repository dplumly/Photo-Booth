//////////////////////////////////////////////////////////////////////
// Buttons to start & stop stream and to capture the image
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnCapture = document.getElementById("btn-capture");

// The stream & capture
const stream = document.getElementById("stream");
const capture = document.getElementById("capture");
const snapshot = document.getElementById("snapshot");

// The video stream
let cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
btnCapture.addEventListener("click", captureSnapshot);




//////////////////////////////////////////////////////////////////////
// Buttons for effects
const btnToggleGrayscale = document.getElementById("btn-toggle-grayscale"); // Button to toggle grayscale
const btnToggleSepia = document.getElementById("btn-toggle-sepia"); // Button to toggle grayscale

// Filter state
let isGrayscale = false; // Flag to track grayscale state
let isSepia = false; // Flag to track sepia state

// Eventlisteners for effects
btnToggleGrayscale.addEventListener("click", toggleGrayscale); 
btnToggleSepia.addEventListener("click", toggleSepia); 




//////////////////////////////////////////////////////////////////////
// Streaming video functions
function startStreaming() {
    let mediaSupport = 'mediaDevices' in navigator;

    if (mediaSupport && null == cameraStream) {
        navigator.mediaDevices.getUserMedia({ video: { width: 800, height: 600 }, audio: false })
            .then(function (mediaStream) {
                cameraStream = mediaStream;
                stream.srcObject = mediaStream;
                stream.play();
            })
            .catch(function (err) {
                console.log("Unable to access camera: " + err);
            });
    } else {
        alert('Your browser does not support media devices.');
        return;
    }
}

function stopStreaming() {
    if (cameraStream) {
        let tracks = cameraStream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        stream.srcObject = null;
        cameraStream = null;
    }
}


//////////////////////////////////////////////////////////////////////
// Capture image with effect
function captureSnapshot() {
    if (null != cameraStream) {
        let ctx = capture.getContext('2d');
        let img = new Image();

        if (isGrayscale) {
            ctx.filter = 'grayscale(100%)';
        } else if (isSepia) {
            ctx.filter = 'sepia(100%)';
        } else {
            ctx.filter = 'none';
        }

        // Draw the video frame to the canvas
        ctx.drawImage(stream, 0, 0, capture.width, capture.height);
        img.src = capture.toDataURL("image/png");
        img.width = 800;
        snapshot.innerHTML = '';
        snapshot.appendChild(img);
    }
}

//////////////////////////////////////////////////////////////////////
// Effects functions
function toggleGrayscale() {
    isGrayscale = !isGrayscale;
    isSepia = false; 
    updateStreamFilter();
}

function toggleSepia() {
    isSepia = !isSepia;
    isGrayscale = false; 
    updateStreamFilter();
}



function updateStreamFilter() {
    if (isGrayscale) {
        stream.classList.add('grayscale-video');
        stream.classList.remove('sepia-video');
    } else if (isSepia) {
        stream.classList.add('sepia-video');
        stream.classList.remove('grayscale-video');
    } else {
        stream.classList.remove('grayscale-video');
        stream.classList.remove('sepia-video');
    }
}





//////////////////////////////////////////////////////////////////////
// Download image function
const btnDownload = document.getElementById("btn-download"); // Button to download the captured image
btnDownload.addEventListener("click", downloadImage); // Add event listener for download

function downloadImage() {
    if (snapshot.firstChild) {
        const link = document.createElement('a');
        link.href = snapshot.firstChild.src;
        link.download = 'captured_image.png';
        link.click();
    } else {
        alert('No image captured to download.');
    }
}
