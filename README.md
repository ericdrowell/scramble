scrambler.js
=========

Scramble text in an image to make it unreadable.  This was originally created to scramble text in license plates found in public photos.

##Example
    <div id="scramberContainer"></div>
    
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
