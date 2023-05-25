const canvas = document.getElementById('MyCanvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const context = canvas.getContext('2d');
const image = new Image();
let OImg = context.getImageData(0, 0, canvas.width, canvas.height);

window.addEventListener('resize', (event) => {
  event.preventDefault();
  var newImage = new Image();
  newImage.src = canvas.toDataURL();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  newImage.onload = function() {
    context.drawImage(newImage,0,0,canvas.width,canvas.height);
  }
  
})

//desenare img
image.onload = function() {
  context.drawImage(image,0,0,canvas.width,canvas.height);
};


//încărcare imagine prin  input de tip file 
const InputFile = document.querySelector(".file_input");

InputFile.addEventListener("change",(event) => {
    let file = InputFile.files[0]; 
    if(file){
        context.clearRect(0,0,canvas.width,canvas.height);
        image.src = URL.createObjectURL(file); 
        InputFile.value = null;
        OImg = context.getImageData(0, 0, canvas.width, canvas.height);
      }
        else alert("Please select an image!"); 
});


//selectare 
const  cropBtn= document.getElementById("btn-crop");
const selectBtn = document.getElementById("btn-select");

let dragging = false;
let X=0, Y=0;
let width=0;
let height=0;
let selectie = null;

  selectBtn.addEventListener('click', function() {
    OImg = context.getImageData(0, 0, canvas.width, canvas.height);
    X=0, Y=0;
    width=canvas.width;
    height=canvas.height;
    canvas.addEventListener('mousedown', mouseDownHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseup', mouseUpHandler);
  });
  

  function mouseDownHandler(event) {
    dragging = true;
    X = event.offsetX;
    Y = event.offsetY;
  }
  
  let originX = 0, originY = 0;

  function mouseMoveHandler(event) {
    if (dragging) {
      if(!event.shiftKey){
        context.putImageData(OImg,0,0);
        context.strokeStyle = "#5d009b";
        context.setLineDash([3, 3]);
        context.lineWidth = 1;
        width = Math.abs(event.offsetX - X);
        height = Math.abs(event.offsetY - Y);
        context.strokeRect(Math.min(X, event.offsetX),Math.min(Y, event.offsetY),width,height);
        
      }
      else{
          context.putImageData(OImg,0,0);
          context.clearRect(originX,originY,width,height);
          context.putImageData(selectie, X, Y);
          X = event.offsetX;
          Y = event.offsetY;

      }
    }
  }
  
  function mouseUpHandler(event) {
    dragging = false;
    originX = X;
    originY = Y;
    selectie = context.getImageData(originX, originY, width, height);
    if(event.shiftKey)
      OImg = context.getImageData(0, 0, canvas.width, canvas.height);
  }

  //stergere selectie
  const stergereBtn = document.getElementById('btn-stergere_select');
  stergereBtn.addEventListener('click', function(event) {
    context.putImageData(OImg,0,0);
    const imageData = context.getImageData(X, Y, width, height);
    let data = imageData.data;
     for (let i = 0; i < data.length; i += 4) {
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
     }
     context.putImageData(imageData, X, Y);
     OImg = context.getImageData(0, 0, canvas.width, canvas.height);
  });

  //crop
  cropBtn.addEventListener('click', function(event) {
  event.preventDefault();
  context.putImageData(OImg,0,0);
  const newW = canvas.width;
  const newH = canvas.height;
  const imageData = context.getImageData(X, Y, width, height);
  const resizeImgData = context.createImageData(newW, newH);
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const i = (y * newW + x) * 4;
      const j = (Math.floor(y * height / newH) * width + Math.floor(x * width / newW)) * 4;
      resizeImgData.data[i] = imageData.data[j];
      resizeImgData.data[i + 1] = imageData.data[j + 1];
      resizeImgData.data[i + 2] = imageData.data[j + 2];
      resizeImgData.data[i + 3] = imageData.data[j + 3];
    }
  }
  context.putImageData(resizeImgData, 0, 0);
  
  X = 0;
  Y = 0;
  width = canvas.width;
  height = canvas.height;
  OImg = context.getImageData(0, 0, canvas.width, canvas.height);
});

const AddBtn = document.getElementById("btn-add_text");

AddBtn.addEventListener('click', function() {
    var text = textInput.value;
    var size = sizeInput.value;
    var color = colorInput.value;
    var xPos = xPosInput.value;
    var yPos = yPosInput.value;

    context.font = size + 'px Arial';
    context.fillStyle = color;
    context.fillText(text, xPos, yPos);
  });

    //text message
var textInput = document.getElementById('textInput');
var sizeInput = document.getElementById('sizeInput');
var colorInput = document.getElementById('colorInput');
var xPosInput = document.getElementById('xPosInput');
var yPosInput = document.getElementById('yPosInput');


  //cancel
const cancel_btn = document.getElementById("cancel-img");
cancel_btn.addEventListener('click', function() {
    context.clearRect(0,0,canvas.width,canvas.height);
    OImg = context.getImageData(0, 0, canvas.width, canvas.height);
});


      
const chooseImgBtn = document.getElementById("choose-img");
chooseImgBtn.addEventListener("click", () => InputFile.click());


//salvare imagine
const save_btn = document.getElementById("save-img");
save_btn.addEventListener("click", (event) => {
    event.preventDefault();
    const urlSalveaza = canvas.toDataURL(); //returenaz un url care rep imaginea
    const linkDoc = document.createElement('a');
    linkDoc.href = urlSalveaza;
    linkDoc.download = 'imagine.jpg'; //sub numele acesta se creaza fisierul
    linkDoc.click(); //trigger save

})