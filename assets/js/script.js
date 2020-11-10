$("#search").on("click", function (event) {
    event.preventDefault();
    var userCity = $("input").val().trim();
    console.log(userCity);

    if (userCity) {
        getCityWeather(userCity);
        userCity = "";
    } else {
        alert("Please enter a city");
    }
});

var getCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=da34e9930b7599f040828dc43b9770ca";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    console.log(data.main)
                })
            } else {
                alert("error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to weatherAPI");
        });
};  