// ELEMENTS START HERE !!!
let apiKey = "4e5fc9fe1423a31d4136d1cb80de83da";

let inputEl = document.getElementById("city-input");

let searchEl = document.getElementById("search-button");

let deleteHistory = document.getElementById("clear-history");

let cityNameEl = document.getElementById("City-Town");

let currentPicEl = document.getElementById("pictures");

let currentTempEl = document.getElementById("temp");

let currentHumidityEl = document.getElementById("heat"); 4

let currentWindEl = document.getElementById("speeds");

let currentUVEl = document.getElementById("uv");

let historyEl = document.getElementById("history");

let CitiesSearched = JSON.parse(localStorage.getItem("search")) || [];


function pullWeather(cityName) {

    let lowerCityName = cityName.toLowerCase();

    let urlSearch = "https://api.openweathermap.org/data/2.5/weather?q=" + lowerCityName + "&appid=" + apiKey;

    fetch(urlSearch)
        .then(function (response) {
            if (response.ok) {
                checkInputCity(lowerCityName);
                return response.json();
            } 
            else {
                alert("Enter a desired City!")
            }
        })

        .then(function (response) {
            let currentDate = moment().format("L");

            cityNameEl.innerHTML = response.name + "(" + currentDate + ")";
            
            let weatherPic = response.weather[0].icon;

            currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");

            currentPicEl.setAttribute("alt", response.weather[0].description);

            currentTempEl.innerHTML = "Temperature: " + kelvinToFahrenheit(response.main.temp) + " &#176F";

            currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";

            currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
            
            let lat = response.coord.lat;

            let lon = response.coord.lon;

            let UVurlSearch = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";

        fetch(UVurlSearch)
            .then(function (response2) {
                return response2.json();
            })

            .then(function (response2) {
                let UVIndex = document.createElement("span");

                currentUVEl.innerHTML = "UV Index: ";

                let UVLevels = response2[0].value;
                if (UVLevels < 2) {
                    UVIndex.setAttribute("class", "badge badge-success");
                }
                else if (UVLevels < 8) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                }
                else {
                    UVIndex.setAttribute("class", "badge badge-danger");
                }
                UVIndex.innerHTML = UVLevels;
                currentUVEl.append(UVIndex);
            })

            let cityID = response.id;
            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;
            fetch(forecastURL)
                .then(function (response2) {
                    return response2.json();
                })
                // OUTCOME COMES OUT HERE !!!!
                .then(function (response2) {
                    let forecastEls = document.querySelectorAll(".forecast");
                    let varDate = moment().format("L");
                    for (i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        let forecastIndex = i * 8 + 4;
                        varDate = moment().add(i + 1, "days").format("L");
                        let forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = varDate;
                        forecastEls[i].append(forecastDateEl);
                        let forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response2.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeatherEl.setAttribute("alt", response2.list[forecastIndex].weather[0].description);
                        forecastEls[i].append(forecastWeatherEl);
                        let forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + kelvinToFahrenheit(response2.list[forecastIndex].main.temp) + " &#176F";
                        forecastEls[i].append(forecastTempEl);
                        let forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response2.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                });
        });
}
// ENTER CITY HERE
let cityChecker = function (event) {
    event.preventDefault();

    let checkCity = inputEl.value

    if (checkCity) {
        pullWeather(checkCity);
    } else {
        alert("Please enter a City")
    }
}

function kelvinToFahrenheit(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

let checkInputCity = function (cityName) {
    let inputCheck = false;
    let knownCities = false;
    for (let i = 0; i < CitiesSearched.length; i++) {
        let storedCity = document.createElement("input");
        storedCity.setAttribute("value", CitiesSearched[i]);
        if (cityName === storedCity.value) {
            inputCheck = true;
            knownCities = true;
        } 
        else {
            if (knownCities === true) {
                inputCheck = true;
            }
        }
    }  
    if (inputCheck === false) {
        CitiesSearched.push(cityName);
        localStorage.setItem("search", JSON.stringify(CitiesSearched));
    }
    displaySearch();
}
// CITY IS DISPLAYED HERE
function displaySearch() {
    historyEl.innerHTML = "";

    for (let i = 0; i < CitiesSearched.length; i++) {
        let storedCity = document.createElement("input");

        storedCity.setAttribute("type", "text");

        storedCity.setAttribute("readonly", true);

        storedCity.setAttribute("class", "form-control d-block bg-white");

        storedCity.setAttribute("value", CitiesSearched[i]);

        storedCity.addEventListener("click", function () {
            pullWeather(storedCity.value);
        })
        historyEl.append(storedCity);
    }
}

function init() {
    displaySearch();

    if (CitiesSearched.length > 0) {
        pullWeather(CitiesSearched[CitiesSearched.length - 1]);
    }
}

//event listeners
searchEl.addEventListener("click", cityChecker);

deleteHistory.addEventListener("click", function () {
    CitiesSearched = [];

    displaySearch();

    localStorage.setItem("search", JSON.stringify(CitiesSearched));
});

init();