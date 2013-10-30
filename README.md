scramble.js
=========

Scramble licese plate text in an image to make it unreadable.

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

To keep this project as light weight as possible, I decided to not use an OpenCV solution.  Instead, I tried several algorithms that analyzed pixel patterns, and ultimately ended up on scrambling areas of the image that are white-ish.  This works because most license plates are white-ish, and if they're dark, they typically have white-ish text.  After running this algorithm on a dozen sample photos, I found that the areas which are most commonly incorrectly scrambled (false positives) include highlights on the car, parking stripes, and sign poles.

If you'd like to improve on the algorithm, by all means, please do, and submit a pull request.


