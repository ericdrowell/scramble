var scrambler = function(config) {
var container = document.getElementById(config.container),
    imageSrc = config.image,
    constrastThreshold = config.constrastThreshold || 100,
    varianceThreshold = config.varianceThreshold || 7,
    scrambleRadius = config.scrambleRadius || 10,
    varianceRadius = config.varianceRadius || 4,
    image = new Image(),
    imageWidth = 497,
    imageHeight = 372,
    copyCanvas,
    copyContext,
    bwCanvas,
    bwContext,
    varianceCanvas,
    varianceContext,
    intersectionCanvas,
    intersectionContext,
    varianceMatrix = [];

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

function applyBlackWhiteFilter() {
  var imageData = copyContext.getImageData(0, 0, imageWidth, imageHeight);

  var d = imageData.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= constrastThreshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v
  }

  bwContext.putImageData(imageData, 0, 0);
}

function findVariances() {
  copy(varianceContext, bwCanvas);

  var bwImageData = bwContext.getImageData(0, 0, imageWidth, imageHeight),
      bwData = bwImageData.data,
      varianceImageData = varianceContext.getImageData(0, 0, imageWidth, imageHeight),
      varianceData = varianceImageData.data,
      pixelsBeforeSwitch = 0,
      lastIsWhite = false,
      isWhite = false,
      pixelsRow,
      isSwitch,
      halfVarianceRadius = varianceRadius / 2;



  // iterate over all pixels based on x and y coordinates
  for(var y = 0; y < imageHeight; y++) {

    pixelsBeforeSwitch = 0;
    lastIsWhite = false;
    isWhite = false;

    // loop through each column
    for(var x = 0; x < imageWidth; x++) {
      var red = bwData[((imageWidth * y) + x) * 4];

      isWhite = red === 255;
      isSwitch = false;

      if (isWhite === lastIsWhite) {
        pixelsBeforeSwitch++;
      }
      else {
        if (pixelsBeforeSwitch > 1 && pixelsBeforeSwitch < varianceThreshold) {
          drawPixel(varianceData, x - halfVarianceRadius, y - halfVarianceRadius, varianceRadius, varianceRadius, 255, 0, 0);
        }
        pixelsBeforeSwitch=0;
      }

      lastIsWhite = isWhite;
    }

  }


  varianceContext.putImageData(varianceImageData, 0, 0);

}

function finalRender() {
  copy(finalContext, copyCanvas);

  var varianceData = varianceContext.getImageData(0, 0, imageWidth, imageHeight).data,
      copyData = copyContext.getImageData(0, 0, imageWidth, imageHeight).data,
      finalImageData = finalContext.getImageData(0, 0, imageWidth, imageHeight),
      finalData = finalImageData.data,
      halfScrambleRadius = scrambleRadius / 2;

  // iterate over all pixels based on x and y coordinates
  for(var y = 0; y < imageHeight; y++) {

    // loop through each column
    for(var x = 0; x < imageWidth; x++) {
      var r = varianceData[((imageWidth * y) + x) * 4];
      var g = varianceData[((imageWidth * y) + x) * 4 + 1];
      var b = varianceData[((imageWidth * y) + x) * 4 + 2];

      var offset = 4 * Math.round(Math.random() * scrambleRadius);

      var cri = ((imageWidth * y) + x) * 4;
      var cgi = ((imageWidth * y) + x) * 4 + 1
      var cbi = ((imageWidth * y) + x) * 4 + 2

      var cr = copyData[cri + offset];
      var cg = copyData[cgi + offset];
      var cb = copyData[cbi + offset];

      if (r === 255
       && g === 0
       && b === 0
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

  bwCanvas = document.createElement('canvas');
  bwCanvas.width = image.width;
  bwCanvas.height = image.height;
  bwContext = bwCanvas.getContext('2d');

  varianceCanvas = document.createElement('canvas');
  varianceCanvas.width = image.width;
  varianceCanvas.height = image.height;
  varianceContext = varianceCanvas.getContext('2d');

  finalCanvas = document.createElement('canvas');
  finalCanvas.width = image.width;
  finalCanvas.height = image.height;
  finalContext = finalCanvas.getContext('2d');

  container.appendChild(copyCanvas);
  container.appendChild(bwCanvas);
  container.appendChild(varianceCanvas);
  container.appendChild(finalCanvas);
}
function init() {
  image.onload = function() {
    onReady();
  };
  image.src = imageSrc;
}

function onReady() {
  addDom();
  copy(copyContext, image);
  applyBlackWhiteFilter();
  findVariances();
  //findDensities();
  //findIntersection();
  finalRender();

}

init();
};