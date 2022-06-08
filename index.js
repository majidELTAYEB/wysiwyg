let textBox, textBoxContent;

$("body").ready(function () {
  initView();
});

const switchBox = document
  .querySelector("#switchBox")
  .addEventListener("change", function () {
    setView(this.checked);
  });

document.querySelectorAll("[data-commande-name]").forEach(function (button) {
  //   console.log("btn",button.dataset.commandeName);
  button.addEventListener("click", function (event) {
    if (
      button.dataset.commandeName == "createlink" ||
      button.dataset.commandeName == "insertImage"
    ) {
      let url = prompt("Saisir votre url", "http://");
      if (url && url != "" && url != "http://") {
        formatDoc(button.dataset.commandeName, url);
      }
    } else {
      formatDoc(button.dataset.commandeName);
    }
  });
});

document.querySelectorAll("[data-commande-select]").forEach(function (button) {
  button.addEventListener("change", function (event) {
    formatDoc(button.dataset.commandeSelect, this[this.selectedIndex].value);
    this.selectedIndex = 0;
  });
});

$("#sendEmail").submit(submitForm);

function initView() {
  textBox = document.getElementById("textBox");
  textBoxContent = textBox.innerHTML;
  if (document.querySelector("#switchBox").checked) {
    setView(true);
  }
}

function formatDoc(commande, value) {
  if (switchView()) {
    document.execCommand(commande, false, value);
    textBox.focus();
  }
}

function switchView() {
  if (!document.querySelector("#switchBox").checked) {
    return true;
  }
  alert('Uncheck "Show HTML".');
  textBox.focus();
  return false;
}

function setView(htmlViewisChecked) {
  let oContent;
  if (htmlViewisChecked) {
    oContent = document.createTextNode(textBox.innerHTML);
    textBox.innerHTML = "";
    let textarea = document.createElement("textarea");
    textBox.contentEditable = false;
    textarea.id = "sourceText";
    textarea.name = "article";
    textarea.contentEditable = true;
    textarea.appendChild(oContent);
    textBox.appendChild(textarea);
    document.execCommand("defaultParagraphSeparator", false, "p");
  } else {
    if (document.all) {
      textBox.innerHTML = textBox.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(textBox.firstChild);
      textBox.innerHTML = oContent.toString();
    }
    textBox.contentEditable = true;
  }
  textBox.focus();
}

function submitForm(event) {
  event.preventDefault();

  let url = prompt("Saisir votre email", "kontemamady750@gmail.com");

  let text;
  if (switchView()) {
    text = textBox.innerHTML;
  } else {
    return false;
  }

  let myformData = new FormData();
  myformData.append("article", text);
  myformData.append("email", url);

  console.log("data", myformData);

  $.ajax({
    type: "POST",
    data: myformData,
    url: "sample.php",
    contentType: false,
    dataType: "json",
    encode: true,
    processData: false,

    beforeSend: function () {
      $("#error").fadeOut();
      $("#valider").html("<span></span> &nbsp; sending ...");
    },
    complete: function () {
      $("#error").fadeOut();
      $("#valider").html("<span></span> &nbsp; envoye");
    },
  })
    .done(function (data) {
      console.log(data.success);
      if (data.success) {
        alert(data.message);
      }
    })
      .done(function (data) {
        console.log(data.success);

      })
      .fail(function (data) {
        console.log(data.responseText);
      });

    event.preventDefault();
  }

$(document).ready(function (){
  let start_button = document.querySelector("#debut-camera");
  let video = document.querySelector("#video");
  let debut_button = document.querySelector("#debut-record");
  let stop_button = document.querySelector("#stop-record");
  let telecharger_link = document.querySelector("#telecharger-video");
  let stop_webcam = $('#stop-webcam');

  let camera_stream = null;
  let media_recorder = null;
  let blobs_recorded = [];

  $(start_button).click( async function() {
    camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = camera_stream;
    $(start_button).css('display','inline-block');
    $(stop_button).css('display','inline-block');
    $(telecharger_link).css('display','inline-block');
    $(debut_button).css('display','inline-block');
    $(stop_webcam).css('display','inline-block');
    $(video).css('display','inline-block')
  });

  $(debut_button).click((function (){
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });
    media_recorder.addEventListener('dataavailable', function(e) {
      blobs_recorded.push(e.data);
    });

    media_recorder.addEventListener('stop', function() {
      // create local object URL from the recorded video blobs
      let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/webm' }));
      telecharger_link.href = video_local;
    });

    media_recorder.start(1000);
  }))

  stop_button.addEventListener('click', function() {
    media_recorder.stop();
  });

  $(stop_webcam).click( function (){
    $(stop_button).css('display','none');
    $(telecharger_link).css('display','none');
    $(debut_button).css('display','none');
    $(stop_webcam).css('display','none');
    $(video).css('display','none');
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks[0].stop();
    tracks.forEach(track => track.stop())

    let obj,
      source;

    obj = document.createElement('video');
    $(obj).attr('width', '250');
    $(obj).attr('controls', ' ');
    source = document.createElement('source');
    $(source).attr('type', 'video/webm');
    $(source).attr('src', '/Users/majideltayeb/downloads/test.webm');

    $("#content").append(obj);
    $(obj).append(source);
  })


})


function initialize() {
  var previousPosition = null;
  map = new google.maps.Map(document.getElementById("map_canvas"), {
    zoom: 19,
    center: new google.maps.LatLng(48.858565, 2.347198),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  if (navigator.geolocation){
    var watchId = navigator.geolocation.watchPosition(successCallback, null, {enableHighAccuracy:true});
    function successCallback(position){


      map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map
      });

      previousPosition = position;
    }

  }

}

$('input[type="file"]').change(function (){
  if(this.files && this.files[0]) {
    const img = document.querySelector('img');
    img.onload = () => {
      URL.revokeObjectURL(img.src);
    }
    $(img).css('display','inline-block');
    img.src = URL.createObjectURL(this.files[0]);

  }
})




 setInterval( 
  function mySave(){
    myContent = document.getElementById("textBox").innerHTML;
    localStorage.setItem("myContent", myContent);
  }
  , 300000);


  document.getElementById('save').addEventListener('click', function mySave(){
    myContent = document.getElementById("textBox").innerHTML;
    localStorage.setItem("myContent", myContent);
  })
 
    document.getElementById('load').addEventListener('click',function myLoad(){
    myContent = localStorage.getItem("myContent");
    document.getElementById("textBox").innerHTML = myContent ;
  })
  
  window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
  });
