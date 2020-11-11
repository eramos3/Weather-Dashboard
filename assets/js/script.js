// selects the div to append to
var currentWeatherDiv = $("#current-weather");
var inputEl = $("input");
// listens for search button click 
$("#search").on("click", function (event) {
    // prevents page from refreshing
    event.preventDefault();
    // stores search text input
    var userCity = inputEl.val().trim();
    // checks to see if there is a value in the search bar then sends the value to getCityWeather function
    if (userCity) {
        getCityWeather(userCity);
        // clears search input
        inputEl.val("");
    } else {
        alert("Please enter a city");
    }
});

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
    var apiUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=da34e9930b7599f040828dc43b9770ca";
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

// displays city data 
var displayWeather = function (searchData) {
    // CLEARs THE DIV
    currentWeatherDiv.empty();
    // creates h2 element to hold city name
    var h2El = $("<h2>").addClass("card-title").attr("id", "current-name").text(searchData.name);
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
    

    if(uvIndex < 3){
        span.addClass("bg-success text-white");
    } else if ( uvIndex >=3 && uvIndex < 6){
        span.addClass("bg-warning text-white");

    } else {
        span.addClass("bg-danger text-white");
    }
}