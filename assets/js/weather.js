$(document).ready(function () {
    const API_KEY = "ac39cc409ece99f7dd30f822b9a7aab5";

    let searchHistory = JSON.parse(window.localStorage.getItem("searchHistory")) || [];

    let desiredcity;

    let currentDay = moment().format("MM/DD/YYYY");

    console.log(currentDay);

    let fifthdayForecast = document.querySelector(".fifthdayForecast");
    cityHistory();

    $("#save-city").on("click", function () {
        console.log("here")
        desiredcity = $("#desiredcity").val();
        getCityWeather(desiredcity);
        addLocalStorage(desiredcity);
        cityHistory(desiredcity);
        fiveDayCast(desiredcity);
        $("#desiredcity").val("");
    });

    $(".listTowns").on("click", 'button', function (event) {
        desiredcity = $(this).attr('id');
        getCityWeather(desiredcity);
        addLocalStorage(desiredcity);
        cityHistory(desiredcity);
        fiveDayCast(desiredcity);
    });

    console.log(searchHistory);

    function cityHistory() {
        let cityHistoryEl = document.querySelector(".listTowns");
        cityHistory.innerHTML = "";

        for (let i = 0; i < searchHistory.length; i++) {
            let cityEl = document.createElement("button");
            cityEl.setAttribute("class", "city-item");
            cityEl.setAttribute("id", searchHistory[i])
            cityEl.textContent = searchHistory[i];
            cityHistoryEl.append(cityEl);
        }
    }

    function addLocalStorage(city) {
        if (searchHistory.indexOf(city) === -1) {
            console.log(searchHistory);
            searchHistory.push(city);
            window.localStorage.setItem(
                "searchHistory",
                JSON.stringify(searchHistory)
            );
        }

        console.log(city);
    }

    function getCityWeather(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city + "&appid=" + API_KEY + "&units=imperial"
        )

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let currentWeatherEl = document.querySelector("#currentWeather");
            currentWeatherEl.innerHTML = "";

            let header = document.createElement("h3");
            header.textContent = data.name;
            currentWeatherEl.appendChild(heading);

            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +
            data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + API_KEY +
            "&units=imperial&exclude=minutely,hourly"
            )

            .them(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                let DaysOTW = document.createElement("p");

                let Icons = document.createElement("img");
                
                let temperature = document.createElement("p");

                let heat = document.createElement("p");

                let speed = document.createElement("p");

                let uv = document.createElement("p");

                Icons.setAttribute(
                    "src", "http://openweathermap.org/img/wn/" +
                    data.current.weather[0].icon + "@2x.png"

                );

                DaysOTW.textContent = "Todays Date: " + currentDay;
                temperature.textContent = "Temperature: " + data.current.temp + " ºf";
                heat.textContent = "Humidity: " + data.current.humidity;
                speed.textContent = "Wind Speeds: " + data.current.wind_speed;
                uv.textContent = "UV Index: " + data.current.uvi;

            })
        })
    }
})