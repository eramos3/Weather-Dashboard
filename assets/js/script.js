// listens for search button click 
$("#search").on("click", function (event) {
    // prevents page from refreshing
    event.preventDefault();
    // stores search text input
    var userCity = $("input").val().trim();
    // checks to see if there is a value in the search bar then sends the value to getCityWeather function
    if (userCity) {
        getCityWeather(userCity);
        userCity.val = "";
    } else {
        alert("Please enter a city");
    }
});

var getCityWeather = function (city) {
    // saves apiurl 
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=da34e9930b7599f040828dc43b9770ca";
    // var apiUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + city.lat + "&lon=" + city.lon + "&appid=da34e9930b7599f040828dc43b9770ca";
    // gets data from api url and checks to see if it went through, if so it executes displayWeather function if not it shows an error
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                   displayWeather(data);
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
var displayWeather = function(searchData) {
    // selects the div to append to
    var currentWeatherDiv = $("#current-weather");
    // creates h2 element to hold city name
    var h2El = $("<h2>").addClass("card-title").attr("id","current-name").text(searchData.name);
    // creates h4 element to hold city temperature
    var h4Temp = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-temp").text("Temperature: " + Math.floor(searchData.main.temp));
    // adds the degree symbol next to temperature 
    var span = $("<span>").html( " &#8457");
    h4Temp.append(span);
    // creates h4 element to hold city humididy
    var h4Humid = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-humidity").text("Humidity: " + Math.floor(searchData.main.humidity) + " %");
    // creates h4 element to hold city wind speed
    var h4Wind = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-wind").text("Wind Speed: " + (searchData.wind.speed).toFixed(1) + " MPH");
    // appends all city data to div
    currentWeatherDiv.append(h2El,h4Temp,h4Humid,h4Wind);
    // var h4Uv = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-uv").text("UV: " + Math.floor(searchData.main.humidity) + " %");
};

