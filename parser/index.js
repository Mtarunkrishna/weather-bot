'use strict';
const dictionary = require('./dictionary');
const moment = require('moment');
let getFeel = temp => {
  if(temp < 5) {
      return "extremely cold";
  }  else if(temp >=5 && temp < 15){
      return "pretty cold";
  } else if(temp >=15 && temp<24){
      return "a bit cold";
  }else if(temp >=24 && temp<34){
      return "warm";
  }else if(temp >=34 && temp <44){
      return "very hot";
  }else if(temp >=44 && temp < 60){
      return "super hot";
  }else if(temp >= 60){
      return "deadly";
  }
};
let getPrefix = (conditionCode, tense='present')=>{
  let findPrefix = dictionary[tense].find(item =>{
     return item.codes.indexOf(Number(conditionCode)) > -1;
  });
  return findPrefix.prefix || "";
};

let getDate = day =>{
    day=day.toLowerCase().trim();
    switch(day){
        case 'tomorrow':
            return moment().add(1,'d').format("DD MMM YYYY");
            break;
        case 'day after tomorrow':
            return moment().add(2,'d').format("DD MMM YYYY");
            break;
        default:
            return moment().format("DD MMM YYYY");
    }
};
let currentWeather = response =>{
    if(response.query.results){
        let resp=response.query.results.channel;
        let location= `${resp.location.city}, ${resp.location.country}`;
        let {text, temp,code} = resp.item.condition;
        return `Right now, ${getPrefix(code)} ${text.toLowerCase()} in ${location}. It is ${getFeel(Number(temp))} at ${temp} degrees.`
    }else{
        return "I don't seem to know anything about this place... Sorry :(";
    }
};
let forecastWeather= (response, data) =>{
    if(response.query.results){
        let parseDate = getDate(data.time);
        let resp=response.query.results.channel;
        let forecast= resp.item.forecast.filter(item => {
           return item.date === parseDate;
        })[0];
        let location= `${resp.location.city}, ${resp.location.country}`;
        let regEx = new RegExp(data.weather,"i");
        let testConditions = regEx.test(forecast.text);
        return `${testConditions ? 'Yes' : 'No'}, ${getPrefix(forecast.code,'future')} ${forecast.text.toLowerCase()} ${data.time} in ${location}.`;
    }else{
        return "I don't seem to know anything about this place... Sorry :(";
    }
};
module.exports={currentWeather,forecastWeather};
