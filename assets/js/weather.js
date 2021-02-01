let apiKey = "4e5fc9fe1423a31d4136d1cb80de83da";

let inputEl = document.getElementById("city-input");

let searchEl = document.getElementById("search-key");

let deleteHistory = document.getElementById("clear-history");

let NameOCEl = document.getElementById("NameOC");

let currentPicEl = document.getElementById("current-pic");

let currentTempEl = document.getElementById("temperature");

let currentheatEl = document.getElementById("heat"); 

let currentWindEl = document.getElementById("speeds");

let currentUVEl = document.getElementById("uv");

let storedEl = document.getElementById("history");

let searchedCity = JSON.parse(localStorage.getItem("search")) || [];

function pullWeather(NameOC) {
    let lowerNameOC = NameOC.toLowerCase();
    let urlSearch = "https://api.openweathermap.org/data/2.5/weather?q=" + lowerNameOC + "&appid=" + apiKey;

    fetch(urlSearch)
        .then(function (response) {
            if (response.ok) {
                checkInputCity(lowerNameOC);
                return response.json();
            } 
            else {
                alert("Please enter a valid city")
            }
        })

        .then(function (response) {
            let currentDate = moment().format("L");
            NameOCEl.innerHTML = response.name + "(" + currentDate + ")";
            let weatherPic = response.weather[0].icon;
            currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt", response.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + kelvinToFahrenheit(response.main.temp) + " &#176F";
            currentheatEl.innerHTML = "heat: " + response.main.heat + "%";
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
                        let forecastheatEl = document.createElement("p");
                        forecastheatEl.innerHTML = "heat: " + response2.list[forecastIndex].main.heat + "%";
                        forecastEls[i].append(forecastheatEl);
                    }
                });
        });
}

let CheckingCity = function (event) {
    event.preventDefault();
    let checkCity = inputEl.value
    if (checkCity) {
        pullWeather(checkCity);
    } else {
        alert("Enter a Town/City here")
    }
}

function kelvinToFahrenheit(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

let checkInputCity = function (NameOC) {
    let inputCheck = false;
    let knownCities = false;
    for (let i = 0; i < searchedCity.length; i++) {
        let storedCity = document.createElement("input");
        
        storedCity.setAttribute("value", searchedCity[i]);

        if (NameOC === storedCity.value) {
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
        searchedCity.push(NameOC);
        localStorage.setItem("search", JSON.stringify(searchedCity));
    }
    displaySearch();
}

function displaySearch() {
    storedEl.innerHTML = "";
    for (let i = 0; i < searchedCity.length; i++) {
        let storedCity = document.createElement("input");
        
        storedCity.setAttribute("type", "text");

        storedCity.setAttribute("readonly", true);

        storedCity.setAttribute("class", "form-control d-block bg-white");
        storedCity.setAttribute("value", searchedCity[i]);

        storedCity.addEventListener("click", function () {
            pullWeather(storedCity.value);
        })
        storedEl.append(storedCity);
    }
}

function init() {
    displaySearch();
    if (searchedCity.length > 0) {
        pullWeather(searchedCity[searchedCity.length - 1]);
    }
}

//event listeners
searchEl.addEventListener("click", CheckingCity);

deleteHistory.addEventListener("click", function () {
    searchedCity = [];
    displaySearch();
    localStorage.setItem("search", JSON.stringify(searchedCity));
});

init();