// selects the div to append to
var currentWeatherDiv = $("#current-weather");
var inputEl = $("input");
var historyContainer = $("#weather-history")
var foreContainer = $("#forecast");

// if nothing in local storage, sets search history to empty array
var searchHistory = JSON.parse(localStorage.getItem("city")) || [];
// loads city search history
$(document).ready(function () {
    getCityWeather("los angeles")
    // gets each value from array and sends it to display history function 
    for (i = 0; i < searchHistory.length; i++) {
        var history = searchHistory[i];
        displayHistory(history);
    }
});
// displays search history under weather history 
var displayHistory = function (history) {
    // creates button element and added a event listener to execute historyButton function
    var hisBtn = $("<button>").addClass("list-item btn btn-light").text(history.toUpperCase()).on("click", historyButton);
    historyContainer.prepend(hisBtn);
};

// listens for search button click 
$("#search").on("click", function (event) {
    // prevents page from refreshing
    event.preventDefault();
    // stores search text input
    var userCity = inputEl.val().trim();
    // checks to see if there is a value in the search bar then sends the value to getCityWeather function
    if (userCity) {
        getCityWeather(userCity);
        displayHistory(userCity);
        searchHistory.push(userCity);
        localStorage.setItem("city", JSON.stringify(searchHistory));
        // clears search input
        inputEl.val("");
    } else {
        alert("Please enter a city");
    }
});

// 
var historyButton = function () {
    // gets text from button and sends it to getcity weather function to execute
    var btnText = $(this).text();
    getCityWeather(btnText);
};

var getCityWeather = function (city) {
    // saves apiurl 
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=da34e9930b7599f040828dc43b9770ca";
    // gets data from api url and checks to see if it went through, if so it executes displayWeather function if not it shows an error
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                    getCityUv(data.coord.lat, data.coord.lon);
                    getCityForecast(data.coord.lat, data.coord.lon);
                })
            } else {
                alert("error: " + response.statusText);

            }
        })
        // if there is a connection error (out of our control) an alert pops up
        .catch(function (error) {
            alert("Unable to connect to weatherAPI");
        });
};

var getCityUv = function (lat, lon) {
    // saves apiurl 
    var apiUv = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=da34e9930b7599f040828dc43b9770ca";
    // gets data from api url and checks to see if it went through, if so it executes displayWeather function if not it shows an error
    fetch(apiUv)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayUv(data.value);
                })
            } else {
                alert("error: " + response.statusText);

            }
        })
        // if there is a connection error (out of our control) an alert pops up
        .catch(function (error) {
            alert("Unable to connect to weatherAPI");
        });
};

var getCityForecast = function (lat, lon) {
    // saves api url
    var apiCity = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lat + "&units=imperial&exclude=hourly,minutely,current&appid=da34e9930b7599f040828dc43b9770ca";
    fetch(apiCity)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayForecast(data);
                })
            } else {
                alert("error: " + response.statusText);

            }
        })
        // if there is a connection error (out of our control) an alert pops up
        .catch(function (error) {
            alert("Unable to connect to weatherAPI");
        });
};

// displays city data 
var displayWeather = function (searchData) {
    // CLEARs THE DIV
    currentWeatherDiv.empty();
    // creates h2 element to hold city name
    var h2El = $("<h2>").addClass("card-title").attr("id", "current-name").text(searchData.name);
    // changes json millisecond format date to readable format
    var cDate = new Date(searchData.dt * 1000).toLocaleDateString(("en-US", { day: "long", month: "long", year: "numeric" }));
    var dateEl = $("<span>").html(" (" + cDate + ")");
    // adds date to h2 element
    h2El.append(dateEl);
    // creates h4 element to hold city temperature
    var h4Temp = $("<h4>").addClass("card-text mb-2 text-muted").attr("id", "current-temp").text("Temperature: " + Math.floor(searchData.main.temp));
    // adds the degree symbol next to temperature and current weather icon as well
    var span = $("<span>").html(" &#8457");
    var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + searchData.weather[0].icon + ".png");
    h4Temp.append(span, img);
    // creates h4 element to hold city humididy
    var h4Humid = $("<h4>").addClass("card-text mb-2 text-muted").attr("id", "current-humidity").text("Humidity: " + Math.floor(searchData.main.humidity) + " %");
    // creates h4 element to hold city wind speed
    var h4Wind = $("<h4>").addClass("card-text mb-2 text-muted").attr("id", "current-wind").text("Wind Speed: " + (searchData.wind.speed).toFixed(1) + " MPH");

    // appends all city data to div
    currentWeatherDiv.append(h2El, h4Temp, h4Humid, h4Wind);
};

var displayUv = function (uvIndex) {

    // creates h4 eement to hold city uv index
    var h4Uv = $("<h4>").addClass("card-text mb-2 text-muted").attr("id", "current-uv").text("UV Index: ");
    var span = $("<span>").html(uvIndex);
    h4Uv.append(span);
    currentWeatherDiv.append(h4Uv);


    if (uvIndex < 3) {
        span.addClass("bg-success text-white");
    } else if (uvIndex >= 3 && uvIndex < 6) {
        span.addClass("bg-warning text-white");

    } else {
        span.addClass("bg-danger text-white");
    }
};

// displays 5 day forecast
var displayForecast = function (forecast) {
    // clears container after next search clicked
    foreContainer.empty();
    // loops through json response to get 5 day forecst
    for (i = 0; i < forecast.daily.length - 3; i++) {
        // creates col 
        var col = $("<div>").addClass("col-lg-2 col-md-4 mt-5");
        // creates card
        var card = $("<div>").addClass("card bg-primary");
        // creates body
        var cardBody = $("<div>").addClass("card-body");
        // sets the unix millisecond date to a readable date using locale date string
        var fDate = new Date(forecast.daily[i].dt * 1000).toLocaleDateString(("en-US", { day: "long", month: "long", year: "short" }));
        // creates card title and sets text to converted date
        var title = $("<h5>").addClass("card-title").text(fDate);
        // finds icon from json response and sets it in img tag
        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecast.daily[i].weather[0].icon + ".png");
        // create span to add fahrenheit degree symbol
        var span = $("<span>").html(" &#8457");
        // adds high temp to card
        var h5Temp = $("<h5>").addClass("card-text mb-2 text-white").text("Temp: " + Math.floor(forecast.daily[i].temp.max));
        // adds city humidity to card
        var h5Humid = $("<h5>").addClass("card-text mb-2 text-white").text("Humidity: " + Math.floor(forecast.daily[i].humidity) + " %");
        // appends everything to container
        foreContainer.append(col.append(card.append(cardBody.append(title, img, h5Temp.append(span), h5Humid))));
    }
};
