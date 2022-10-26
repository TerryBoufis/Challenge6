const API_Key = 'af5f5d4b53f83042c9c9514d57f3dc7e';
const userCityInput = document.getElementById("cityInput")
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEL = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const cityName = document.getElementById('cityName')
const searchHistory = document.getElementById("searchHistory")

timeEl.innerText = new Date().toLocaleTimeString("en-us", {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
})

dateEl.innerText = new Date().toLocaleDateString("en-us", {
    month: 'long', weekday: 'short', day: 'numeric'
})

setInterval(() => {
    timeEl.innerText = new Date().toLocaleTimeString("en-us", {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    })

    dateEl.innerText = new Date().toLocaleDateString("en-us", {
        month: 'long', weekday: 'short', day: 'numeric'
    })
}, 1000)

populateSearch()

function populateSearch() {
    if (localStorage.getItem("searchHistory")) {
        searchHistory.innerHTML = ''
        const historyArray = JSON.parse(localStorage.getItem('searchHistory'))
        for (var i = 0; i < historyArray.length; i++) {
            var button = document.createElement("button")
            button.innerText = historyArray[i]
            button.addEventListener('click', function (e) { 
                // startSearch(historyArray[i])
                startSearch(e.currentTarget.innerText)
             })
            searchHistory.append(button)
        }
    }
}

document.getElementById("search").addEventListener("click", function () { startSearch(userCityInput.value) })

function startSearch(cityToSearch) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&appid=${API_Key}`)

        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data)
            cityName.innerText = data[0].name

            if (localStorage.getItem('searchHistory')) {
                const historyArray = JSON.parse(localStorage.getItem('searchHistory'))
                if (!historyArray.includes(data[0].name)) historyArray.push(data[0].name)
                localStorage.setItem('searchHistory', JSON.stringify(historyArray))
            } else {
                localStorage.setItem('searchHistory', JSON.stringify([data[0].name]))
            }

            populateSearch()

            getWeatherData(data)
            getForecastData(data)
        }
        );

    function getWeatherData(data) {


        let { lat, lon } = data[0];

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=imperial`).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);

        })


    }

    function getForecastData(data) {
        let { lat, lon } = data[0];
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}&units=imperial`).then(res => res.json()).then(data => {

            weatherForecastEL.innerHTML = ``

            for (var i = 4; i < data.list.length; i += 8) {
                console.log(data.list[i])
                //genearate a card
                //append it to weatherforecastel
                //     <div class="weather-forecast-item">
                //     
                // </div>
                const icon = data.list[i].weather[0].icon
                const humidity = data.list[i].main.humidity;
                const wind_speed = data.list[i].wind.speed;
                const temp = data.list[i].main.temp;
                const day = data.list[i].dt;

                const div = document.createElement('div')
                div.classList.add('weather-forecast-item')
                div.innerHTML = `<div class="day">${new Date(day * 1000).toLocaleString("en-US", { weekday: 'long' })}</div>
                   <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon" class="w-icon">
                   <div class="weather-item">
                    <div>Temp</div>
                    <div>${temp}&#176 F</div>
                <div class="weather-item">
                    <div>Humidity</div>
                    <div>${humidity}%</div>
                </div>
                <div class="weather-item">
                    <div>Wind Speed</div>
                    <div>${wind_speed} mph</div>
                </div>`

                weatherForecastEL.append(div)
            }


        })
    }




    function showWeatherData(data) {
        const humidity = data.main.humidity;
        const wind_speed = data.wind.speed;
        const temp = data.main.temp;
        const icon = data.weather[0].icon;

        currentWeatherItemsEl.innerHTML =
            `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon" class="w-icon"></img>

                <div class="weather-item">
                    <div>Temp</div>
                    <div>${temp}&#176 F</div>
                <div class="weather-item">
                    <div>Humidity</div>
                    <div>${humidity}%</div>
                </div>
                <div class="weather-item">
                    <div>Wind Speed</div>
                    <div>${wind_speed} mph</div>
                </div>`
    }
}