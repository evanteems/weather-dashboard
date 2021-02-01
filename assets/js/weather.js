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
        }
    }
})