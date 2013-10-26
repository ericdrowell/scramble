scrambler.js
=========

Scramble text in an image to make it unreadable.  This was originally created to scramble text in license plates found in public photos.

##Screenshot

![alt text][logo]

[logo]: https://raw.github.com/ericdrowell/scrambler/master/screenshot.png "scrambler.js screenshot"

##Example
    <div id="scramberContainer"></div>
    
    <script src="scrambler.js"></script>
    <script>
      scrambler({
        container: 'scramblerContainer',
        image: 'car.jpg',
        constrastThreshold: 100,
        varianceThreshold: 7,
        varianceRadius: 4,
        scrambleRadius: 10
      });
    </script>

##Algorithm

The text scrambling algorithm is actually fairly simple (and could surely be improved).  It's done in four steps:

1. the image is copied onto a canvas
2. the image pixels are converted to black or white
3. The black and white image is scanned for pixel variance, in which there's a lot of switching between black and white pixels.  This is a distinguishing feature of text in an image
4. for every location found with a high pixel variance, scramble the pixels on the original image in that area.

This version of the algorithm is certainly not perfect.  You can tell from the final image that some portions of the image are scrambled which are not text.  For my purposes, this was satisfactory.  If you'd like to improve on the algorithm, by all means, please do, and submit a pull request.


