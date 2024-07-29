let audioContext;
let analyser;
let dataArray;
let bufferLength;
let audioElement = document.getElementById('audio-element');
let canvas = document.getElementById('waveform-canvas');
let canvasCtx = canvas.getContext('2d');

// Disable the play button initially
audioElement.controls = false;

// Function to draw the waveform
function draw() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = document.getElementById('wave-color').value;

    canvasCtx.beginPath();
    let sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    requestAnimationFrame(draw);
}

// Function to load audio file
document.getElementById('audio-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        audioElement.src = URL.createObjectURL(file);
        audioElement.load();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        let source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        draw();

        // Show the waveform and color picker controls
        canvas.style.display = 'block';
        document.querySelector('.color-picker-row').style.display = 'flex';
        
        // Enable the audio controls
        audioElement.removeAttribute('disabled');
        audioElement.controls = true;
    }
});

// Handle waveform color change
document.getElementById('wave-color').addEventListener('input', function () {
    if (canvasCtx) {
        canvasCtx.strokeStyle = this.value;
    }
});
