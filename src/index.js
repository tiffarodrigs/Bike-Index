//import files
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import BikeService from './js/bike-service.js';

function getHighestStolenNamufactuer (manufacture) {
  if(manufacture.length == 0)
    return null;
  let manObj = {};
  let maxEl = manufacture[0];
  let maxCount = 1;
  for(var i = 0; i < manufacture.length; i++) {
    var el = manufacture[i];
    if(manObj[el] == null)
      manObj[el] = 1;
    else
      manObj[el]++;  
    if(manObj[el] > maxCount)
    {
      maxEl = el;
      maxCount = manObj[el];
    }
  } 
  return maxEl + " has had " + manObj[maxEl] + " stolen since ";
}

function getElements(response, userInputDate) {
  if (response.bikes) {
    let manufacture = [];
    response.bikes.forEach(function(bikes){
      manufacture.push(bikes.manufacturer_name);
      let dateList = new Date((bikes.date_stolen)*1000);
      let userInputDateObj = new Date(userInputDate);
      if (userInputDateObj < dateList) {
        $("#bike-output").append("Title: " + bikes.title + "<br>");
        $("#bike-output").append("Stolen Location: " + bikes.stolen_location + "<br>");
        $("#bike-output").append("Date Stolen: " + new Date((bikes.date_stolen)*1000) + "<br>");
        if (bikes.large_img === null) {
          $("#bike-output").append("No Image Available<br>");
        } else {
          $("#bike-output").append("<img src=\"" + bikes.large_img + "\" alt=\"image of bike\"><br>");
        }
        
        $("#bike-output").append("<br>");
        const highestStolen = getHighestStolenNamufactuer(manufacture);
        
        $("#model-count").text(highestStolen + dateList);
      } 
    });

  } else {
    $("#error").text(`There was an error: ${response.message}`);
  }
}


function getElementsForAllCityStats (response, userInputDate) {
  let stateCodeArray=[];
  
  if (response.bikes) {
    response.bikes.forEach(function(bike) {
      if (bike.stolen_location !== null) {
        let dateList = new Date((bike.date_stolen)*1000);
        let userInputDateObj = new Date(userInputDate);
        if (userInputDateObj < dateList) {
          let stolenLocation= bike.stolen_location;
          let countryCode = stolenLocation.split("");
          let stateCode=(countryCode[countryCode.length - 2] + countryCode[countryCode.length - 1]);
          stateCodeArray.push(stateCode);
        }
        //$("#bikes-by-city").append
      }
    });
    const highestStat = getHighestStolenNamufactuer(stateCodeArray);
    //console.log("highestStat : " +highestStat);
    $("#bikes-by-city").append(highestStat + userInputDate);
  } else {
    $("#error").text(`There was an error: ${response.message}`);
  }
}

async function makeApiCallAllCities(userInputDate) {
  const response = await BikeService.showCity();
  console.log("index.js: ", response);
  getElementsForAllCityStats(response, userInputDate);
}

$(document).ready(function() {
  $("#find-bikes").click(function() {
    $("#bike-output").text("");
    let location = $("#location").val();
    let userInputDate = $("#dateSince").val();
    userInputDate = userInputDate.replace(/-/g,'/');
    BikeService.showBike(location)
      .then(function(response) {
        getElements(response,userInputDate);
      });
    makeApiCallAllCities(userInputDate);
  });
});