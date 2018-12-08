'use strict';
const matcher=require('../matcher');
const weather=require('../weather');
const {currentWeather,forecastWeather}=require('../parser');
function sendResponse(f,sender,reply){
    matcher(reply, async data => {
        try {
            switch (data.intent) {
                case 'Hello':
                    await f.txt(sender, `${data.entities.greeting} to you too!`);
                    await f.img(sender,'https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg');
                    break;
                case 'Exit':
                    await f.txt(sender, "Have a great day!");
                    break;
                case 'CurrentWeather':

                    await f.txt(sender, `Let me check...`);
                    weather(data.entities.city, 'current')
                        .then(async response => {
                            await f.txt(sender, currentWeather(response));
                        })
                        .catch(async error => {
                            await f.txt(sender, "There seems to be a problem connecting to the Weather service.");
                        });
                    break;
                case 'WeatherForecast':
                    await f.txt(sender, `Let me check...`);
                    weather(data.entities.city, 'forecast')
                        .then(async response => {
                            await f.txt(sender, forecastWeather(response, data.entities));
                        })
                        .catch(async error => {
                            await f.txt(sender, "There seems to be a problem connecting to the Weather service.");
                        });
                    break;
                default:
                    await f.txt(sender, "I don't know what you mean :(");
            }
        }catch(e){
            console.log("Error occurred");
            await f.txt(sender, "An internal error occurred.");
        }
    });
}
module.exports=sendResponse;