$("#search").on("click", function (event) {
    event.preventDefault();
    var userCity = $("input").val().trim();

    if (userCity) {
        getCityWeather(userCity);
        userCity.val = "";
    } else {
        alert("Please enter a city");
    }
});

var getCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=da34e9930b7599f040828dc43b9770ca";
    // var apiUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + city.lat + "&lon=" + city.lon + "&appid=da34e9930b7599f040828dc43b9770ca";
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
        .catch(function (error) {
            alert("Unable to connect to weatherAPI");
        });
};  

var displayWeather = function(searchData) {
    var currentWeatherDiv = $("#current-weather");
    var h2El = $("<h2>").addClass("card-title").attr("id","current-name").text(searchData.name);
    var h4Temp = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-temp").text("Temperature: " + Math.floor(searchData.main.temp));
    var span = $("<span>").html( " &#8457");
    h4Temp.append(span);
    var h4Humid = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-humidity").text("Humidity: " + Math.floor(searchData.main.humidity) + " %");
    var h4Wind = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-wind").text("Wind Speed: " + (searchData.wind.speed).toFixed(1) + " MPH");
    currentWeatherDiv.append(h2El,h4Temp,h4Humid,h4Wind);
    var h4Uv = $("<h4>").addClass("card-text mb-2 text-muted").attr("id","current-uv").text("UV: " + Math.floor(searchData.main.humidity) + " %");
};

