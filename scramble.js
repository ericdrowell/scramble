/*
 * Created by Eric Rowell for a hackday project at LinkedIn
 * scrambler.js uses HTML5 canvas to scan an image for text and then
 * scrambles it so that it's unreadable.  Since this was built in one day,
 * the algorithm, and the code itself, could be greatly enhanced.  But it works.
 */

 var scramble = function(config) {
var container = document.getElementById(config.container),
    imageSrc = config.image,
    brightnessRatioThreshold = config.brightnessRatioThreshold || 0.5,
    colorVarianceThreshold = config.colorVarianceThreshold || 50,
    scrambleRadius = config.scrambleRadius || 10,
    image = new Image(),
    imageWidth,
    imageHeight,
    copyCanvas,
    copyContext;

/*================== utils ==================*/

function copy(dest, src) {
  dest.drawImage(src, 0, 0);
}

function drawPixel(data, x, y, width, height, r, g, b) {
  for (var nx=x; nx<x+width; nx++) {
    for (var ny=y; ny<y+height; ny++) {

      var ri = ((imageWidth * ny) + nx) * 4,
          gi = ((imageWidth * ny) + nx) * 4 + 1,
          bi = ((imageWidth * ny) + nx) * 4 + 2,
          ai = ((imageWidth * ny) + nx) * 4 + 3;

      if (ri > 0 && ri < data.length) {


        data[ri] = r;
        data[gi] = g;
        data[bi] = b;
        data[ai] = 255;

      }
    }
  }
}

/*================== filters ==================*/


function scrambleWhiteAreas() {
  copy(finalContext, copyCanvas);

  var copyData = copyContext.getImageData(0, 0, imageWidth, imageHeight).data,
      finalImageData = finalContext.getImageData(0, 0, imageWidth, imageHeight),
      finalData = finalImageData.data,
      halfScrambleRadius = scrambleRadius / 2,
      brightnessArr = [];

  // first calculate the average brightness
  for (var i=0; i<copyData.length; i+=4) {
    var r = copyData[i];
    var g = copyData[i+1];
    var b = copyData[i+2];
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    brightnessArr[v] = v;
  }

  var condensedArr = [];

  for (var n=0; n<brightnessArr.length; n++) {
    var val = brightnessArr[n];
    if (val) {
      condensedArr.push(val);
    }
  }

  var threshold = condensedArr[Math.round(condensedArr.length * brightnessRatioThreshold)];




  // iterate over all pixels based on x and y coordinates
  for(var y = 0; y < imageHeight; y++) {

    // loop through each column
    for(var x = 0; x < imageWidth; x++) {
      var r = copyData[((imageWidth * y) + x) * 4];
      var g = copyData[((imageWidth * y) + x) * 4 + 1];
      var b = copyData[((imageWidth * y) + x) * 4 + 2];

      var offset = 4 * (Math.round(Math.random() * scrambleRadius) - (scrambleRadius / 2));

      var cri = ((imageWidth * y) + x) * 4;
      var cgi = ((imageWidth * y) + x) * 4 + 1
      var cbi = ((imageWidth * y) + x) * 4 + 2

      var cr = copyData[cri + offset];
      var cg = copyData[cgi + offset];
      var cb = copyData[cbi + offset];

      var rgDiff = Math.abs(g- r);
      var gbDiff = Math.abs(b - g);
      var brDiff = Math.abs(r - b);

      var colorVariance = Math.max(Math.max(rgDiff, gbDiff), brDiff);

      // if pixel is white-ish
      if (r > threshold
       && g > threshold
       && b > threshold

       ) {

        drawPixel(finalData, x - halfScrambleRadius, y, scrambleRadius, 1, cr, cg, cb);
      }
    }
  }

  finalContext.putImageData(finalImageData, 0, 0);
}

/*================== initialization ==================*/
function addDom() {
  copyCanvas = document.createElement('canvas');
  copyCanvas.width = image.width;
  copyCanvas.height = image.height;
  copyContext = copyCanvas.getContext('2d');

  finalCanvas = document.createElement('canvas');
  finalCanvas.width = image.width;
  finalCanvas.height = image.height;
  finalContext = finalCanvas.getContext('2d');

  container.appendChild(copyCanvas);
  container.appendChild(finalCanvas);
}
function init() {
  image.onload = function(img) {
    imageWidth = image.width;
    imageHeight = image.height;
    onReady();
  };
  image.src = imageSrc;
}

function onReady() {
  addDom();
  copy(copyContext, image);
  scrambleWhiteAreas();
  //applyBlackWhiteFilter();
  //findVariances();
  //finalRender();

}

init();
};