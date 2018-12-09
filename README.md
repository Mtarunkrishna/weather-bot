# vanilla-weather-bot
A simple chatbot that tells you the current weather and weather forecast.

It uses Node.JS for the backend server and it is connected to Facebook Messenger using the FB Messenger API. This repository provides code for hosting it both on **Heroku** and for hosting it on `localhost`(which can then be exposed using for example `ngrok`). It uses the Yahoo Weather API to get weather information.

The repository contains 2 branches, the `master` branch for deploying using `localhost` and the `heroku` branch for deploying using Heroku. 

This chatbot uses simple pattern matching i.e. regular expressions to extract intents and entities. If the patterns match it appropriately calls the Yahoo Weather API and parses the response properly to give a nice human readable reply.
All the code for webhook registration, receiving messages and sending messages has been written.

Rename `template.development.json` to `development.json` and enter in the actual values for `pageAccessToken` etc. by replacing the dummy values. On Heroku, set the environment variables to this instead.

# Localhost version:
## Use the `master` branch 
## Prerequisites:
- Node.JS version 10.11.0.
- NPM version 6.4.1
- A utility like ngrok
Install the latest version by executing:
```
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install nodejs
```
Alternatively use `nvm` to install the specific version I used.

- All the node modules that are required are already present in the `package.json`. They are:
  + "body-parser": "1.18.3",
  + "colors": "1.3.2",
  + "express": "4.16.4",
  + "moment": "^2.22.2",
  + "request": "2.88.0",
  + "xregexp": "4.2.0",
  + "yql": "1.0.2"
- To install these, use `npm i` inside the `vanilla-weather-bot` directory.

## How to run:
Start the server using `node server.js` and start `ngrok`. Register your webhook on Facebook Messenger. You're done, now you can start sending and receiving messages.

# Heroku version:
## Use the `heroku` branch

## How to deploy:
Simply use `git` to deploy the repository to Heroku. Set the environment variables as you would set them in `development.json`. Use the URL to register the webhook on Facebook Messenger. You're done!

# Valid queries:
![queries](https://github.com/ajd12342/vanilla-weather-bot/blob/heroku/Screenshot_20181209-234339.jpg)

