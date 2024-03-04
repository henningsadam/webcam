const videoElement = document.getElementById('video');
let screenResolution = document.getElementById('screenResolution').value;

console.log(screenResolution)

let screenX = screenResolution.split('x')[0]
let screenY = screenResolution.split('x')[1]
console.log(screenX)
console.log(screenY)

let constraints = {
  video: {
    width: { min: screenX },
    height: { min: screenY },
  },
  audio: true,
};

let stream;

const setContraints = (screenX, screenY) => {
  constraints = {
    video: {
      width: { min: screenX },
      height: { min: screenY },
    },
    audio: true,
  };
}

const resolutionChangeHandler = () => {
  screenResolution = document.getElementById('screenResolution').value;
  screenX = screenResolution.split('x')[0]
  screenY = screenResolution.split('x')[1]
  console.log(screenResolution)
  setContraints(screenX, screenY)
  getStream(constraints);
}

const getStream = async (mediaContraints) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(mediaContraints);
    console.log('Stream initialized');
  } catch (error) {
    console.log(error);
  }
};

const startVideo = () => {
  videoElement.srcObject = stream;
  console.log('Video started');
};

const stopVideo = () => {
  videoElement.srcObject = null;
  console.log('Video stopped');
};

const videoChunks = []
let mediaRecorder

let recordingStatusElement = document.getElementById('recording-status')

const startRecording = () => {
  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.start(10)
  mediaRecorder.ondataavailable = e => videoChunks.push(e.data)
  recordingStatusElement.classList.toggle('hidden')
}

const stopRecording = () => {
  recordingStatusElement.classList.toggle('hidden')
  mediaRecorder.stop()
  const blob = new Blob(videoChunks, {
    type: 'video/webm'
  })
  const url = URL.createObjectURL(blob)
  const downloadBtn = document.getElementById('file-download')
  downloadBtn.href = url
  downloadBtn.download = Date.now().toString() + '-' + 'something.webm'
  downloadBtn.classList.toggle('hidden')
}

getStream(constraints);