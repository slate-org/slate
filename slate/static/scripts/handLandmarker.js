//Mediapipe Landmarks Function
import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";    // Try using specific version if this doesn't work: 0.10.0 or 0.10.14

const demosSection = document.getElementById("demos");              // Temp

// Mediapipe model loaded with options. Use .detect(~~img~~) for landmarks.
// handLandmarker will be loaded when createHandLandmarker() is called.
let handLandmarker = undefined;
let enableWebcamButton = undefined;
let webcamRunning = false;
let runningMode = 'VIDEO';

// Landmarks sequence array to be sent to ML model
let sequence = [];

async function createHandLandmarker() {
    const vision = await
        FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
        },
        runningMode: runningMode, // Change this for Image --> Webcam Input
        numHands: 1
    });
    demosSection.classList.remove("invisible")
} createHandLandmarker();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam is supported
const hasGetUserMedia = () => !! navigator.mediaDevices?.getUserMedia;
// If supported, add event listener to the button
if(hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("Webcam is not supported by your browser.");
}

function enableCam(event) {
    if(!handLandmarker){
        console.log("Mediapipe model has not loaded yet!");
        return;
    }

    if(webcamRunning === true){
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    const constraints = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;
console.log(video);
async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    let startTime = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTime);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if(results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, landmarks, {
                color: "#FF0000",
                lineWidth: 2
            });
        }
    }
    canvasCtx.restore();
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }

    // Collect landmark sequence to send as input to ML model
    if (results.worldLandmarks[0]) {
        let outputValues = [];
        getLandmarksArray(outputValues);
        if (sequence.length < 20) {
            sequence.push(outputValues);
        } else {
            sequence = sequence.slice(-10);
            // console.log(sequence);
        }
    }

    // Make the prediction
    try {
        result = model.predict(tf.tensor3d(sequence.slice(-10).flat(), [1, 10, 63]));
        if (letters[result.reshape([24]).argMax().dataSync()] === letter) {
            outputText.innerText = "Correct";
            outputText.style.color = "green";
        } else {
            outputText.innerText = "Incorrect";
            outputText.style.color = "red";
        }
        // outputText.innerText = letters[result.reshape([24]).argMax().dataSync()];
    }
    catch (error) {
        console.log("Not enough sequences yet.");
    }
}

// Load the TensorFlow.js model
// let url = window.location.href;
// url = url.replace('learn/beginner/letters', '');
const model = await tf.loadLayersModel('http://' + location.host + '/static/mlModels/jsModel/model.json');
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm',
                    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']
let result = undefined;
let outputText = document.getElementById('outputText');
const letter = document.getElementById("outputText").dataset.letter;

function getLandmarksArray (outputValues) {
    for (let i = 0; i < 21; i++) {
        outputValues.push(results.worldLandmarks[0][i].x);
        outputValues.push(results.worldLandmarks[0][i].y);
        outputValues.push(results.worldLandmarks[0][i].z);
    }
}

// Method used to get csrf-token cookie (method definition taken from Django csrf documentation)
function getCookie(name) {
    let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// $(document).ready(
//     $('#outputButton').click(function() {
//         if(sequence.length >= 10) {
//             $.ajax(
//                 {
//                     url: "../getPrediction/",
//                     type: "POST",
//                     data: {
//                         'sequence': sequence.slice(-10)
//                     },
//                     headers: {
//                         "X-Requested-With": "XMLHttpRequest",
//                         "X-CSRFToken": getCookie("csrftoken")
//                     },
//                     success: function (response) {
//                         $('#outputText').text("Output: " + response);
//                         alert(response);
//                     },
//                     error: function (response) {
//                         $('#outputText').text("Error.");
//                         alert("Error");
//                     }
//                 }
//             );
//         }
//         else {
//             alert("Not Enough Sequences");
//         }
//     })
// );


// document.getElementById("outputButton").addEventListener("click", function (){
//     let result = model.predict(tf.tensor3d(sequence.slice(-10).flat(), [1, 10, 63]));
//     result.reshape([24]).argMax().print();
//     console.log(letters[result.reshape([24]).argMax().dataSync()]);
//     // console.log(result);
// })
