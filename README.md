scramble.js
=========

Scramble text in an image to make it unreadable.  This was originally created to scramble text in license plates found in public photos.

##Screenshot

![alt text][logo]

[logo]: https://raw.github.com/ericdrowell/scramble/master/screenshot.png "scramble.js screenshot"

##Example
    <div id="scramberContainer"></div>

    <script src="scramble.js"></script>
    <script>
      scramble({
        container: 'scrambleContainer',
        image: 'photos/car.jpg',
        brightnessRatioThreshold: 0.5,
        scrambleRadius: 10
      });
    </script>

##Algorithm

To keep this project as light weight as possible, I decided to not use an OpenCV solution.  Instead, I tried several algorithms, and ultimately ended up on scrambling areas of the image that are white-ish.  This works because most license plates are white-ish, and if they're dark, they typically have white-ish text.  Typically, areas that are incorrectly scrambled (false positives) include highlights on the car, parking strips, and sign poles.

If you'd like to improve on the algorithm, by all means, please do, and submit a pull request.


