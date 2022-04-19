var name = '';
var encoded = null;
var fileExt = null;
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone');


function searchFromVoice() {
  recognition.start();

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    console.log(speechToText);

    document.getElementById("searchbar").value = speechToText;
    search();
  }
}



function search() {
  var searchTerm = document.getElementById("searchbar").value;
  var apigClient = apigClientFactory.newClient();

  var params = {
    "q": searchTerm
  };
  var body = {
    "q": searchTerm
  };

  var additionalParams = {
    queryParams: {
      q: searchTerm
    }
  };
  console.log(searchTerm);
  apigClient.searchGet(params, body, additionalParams)
    .then(function (result) {
      console.log('success OK');
      showImages(result.data);
    }).catch(function (result) {
      console.log("Success not OK");
    });
}


function showImages(res) {
  var newDiv = document.getElementById("images");
  if(typeof(newDiv) != 'undefined' && newDiv != null){
  while (newDiv.firstChild) {
    newDiv.removeChild(newDiv.firstChild);
  }
  }
  
  console.log(res);
  if (res.length == 0) {
    var newContent = document.createTextNode("No image to display");
    newDiv.appendChild(newContent);
  }
  else {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i]);
      var newDiv = document.getElementById("images");
      //newDiv.style.display = 'inline'
      var newimg = document.createElement("img");
      var classname = randomChoice(['big', 'vertical', 'horizontal', '']);
      if(classname){newimg.classList.add();}
      newimg.src = res[i];
      newDiv.appendChild(newimg);

      //var currentDiv = document.getElementById("div1");
      //document.body.insertBefore(newDiv, currentDiv);
    }
  }
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const realFileBtn = document.getElementById("realfile");
console.log(realFileBtn);

function upload() {
  realFileBtn.click(); 
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.onload = () => resolve(reader.result)
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }


  function previewFile(input) {

    var reader = new FileReader();
    name = input.files[0].name;
    file = input.files[0];
    console.log(file)
    console.log(name);
    fileExt = name.split(".").pop();
    var onlyname = name.replace(/\.[^/.]+$/, "");
    var finalName = onlyname + "_" + Date.now() + "." + fileExt;
    name = finalName;

    console.log(file.type)
  
    reader.onload = function (e) {
      var src = e.target.result;
      
      var newImage = document.createElement("img");
      newImage.src = src;
      encoded = newImage.outerHTML;
      //console.log(encoded);
  
      last_index_quote = encoded.lastIndexOf('"');
      if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png') {
        encodedStr = encoded.substring(33, last_index_quote);
      }
      else {
        encodedStr = encoded.substring(32, last_index_quote);
      }
      let config = {
        headers: { 'Content-Type': file.type }
    };
    if (document.getElementById('customlabels').value != '') {
      config.headers = {
        ...config.headers,
        'x-amz-meta-customlabels': document.getElementById('customlabels').value
      }
    }

    //url = 'https://cors-anywhere.herokuapp.com/corsdemo/https://cors-anywhere.herokuapp.com/corsdemo/https://2l1u57c3j8.execute-api.us-east-1.amazonaws.com/dev2/myphotosbucket4/' + file.name
    //url = "https://wv9kh6mcxi.execute-api.us-east-1.amazonaws.com/doNotUse/upload/myphotosbucket4/" + file.name
    //url = "url = \"https://wv9kh6mcxi.execute-api.us-east-1.amazonaws.com/doNotUse/upload/myphotosbucket4/\" + file.name
    url = "https://2l1u57c3j8.execute-api.us-east-1.amazonaws.com/testCustomLabel/myphotosbucket4/"+ finalName ;
    axios.put(url, file, config).then(response => {
    //  console.log(" New "+response.data)
    //  alert("Image uploaded successfully!");
     console.log("Success");
     alert("Image uploaded successfully!");

   });

    }
    reader.readAsDataURL(input.files[0]);
  }
  
  
  