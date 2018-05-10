# smart-mirror

This repo contains web app and Arduino code for our final project for Wendy Ju's Interactive Device Design.

Check out the wiki to learn more about the final product.

## Web app

The web app used for the mirror's display is [deployed live](https://thawing-ravine-47191.herokuapp.com/). To develop it locally, follow the directions below.

First, install the package. There are a lot of dependencies. This will take a little bit.

```
npm i
```

Then, procure a ``.env`` file from Emily to get the API keys. Once that's in the right place, you should be able to run the app.

```
npm start
```

## Sensor communication

The script in ``sensor.js`` should be uploaded to the Raspberry Pi. The code in ``distanceactivation`` should be flashed to the Arduino.

Made with <3 at Cornell Tech.
