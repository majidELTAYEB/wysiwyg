const record = document.querySelector('.record');//a creer
const stop = document.querySelector('.stop');//a creer
const soundClips = document.querySelector('.sound-clips');//a creer
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');
  navigator.mediaDevices.getUserMedia(
    // constraints - only audio needed for this app
    {
      audio: true
    })

    // Success callback
    .then(function (stream) {
      // MediaRecorder.start()sert à lancer l'enregistrement du flux une fois le bouton d'enregistrement appuyé :
      const mediaRecorder = new MediaRecorder(stream);
      record.onclick = function () {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
      }
      //Nous enregistrons un gestionnaire d'événements pour ce faire en utilisant mediaRecorder.ondataavailable:
      let chunks = [];

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      }
      //nous utilisons la MediaRecorder.stop()méthode pour arrêter l'enregistrement lorsque le bouton d'arrêt est enfoncé
      stop.onclick = function () {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
      }
      //Lorsque l'enregistrement s'est arrêté, la statepropriété renvoie une valeur "inactive" et un événement d'arrêt est déclenché. Nous enregistrons un gestionnaire d'événements pour cela en utilisant mediaRecorder.onstop, et y finalisons notre blob à partir de tous les morceaux que nous avons reçus :
      mediaRecorder.onstop = function (e) {
        console.log("recorder stopped");
        const clipContainer = document.createElement('article');
        const clipName = prompt('Un nom pour votre vocal','Mon nom de clip');
        const clipLabel = document.createElement('p');
        const audio = document.createElement('audio');
        const deleteButton = document.createElement('button');

        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        deleteButton.innerHTML = "Delete";
        clipLabel.innerHTML = clipName;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;

        deleteButton.onclick = function (e) {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        }
      }
    })

    // Error callback
    .catch(function (err) {
      console.log('The following getUserMedia error occurred: ' + err);
    }
    );
} else {
  console.log('getUserMedia not supported on your browser!');
}

