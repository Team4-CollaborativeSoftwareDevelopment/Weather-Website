const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const currentWeatherItems2El = document.getElementById('current-weather-items2');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '698e13e565fa42bf8d93b2e10f39fc6e';
let geoLocation = null
let longitude = null
let latitude = null


setInterval(() => { 
  if(geoLocation){
    getDynamicData(latitude,longitude)
  }
},1000)

function getDynamicData(lat,lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    getFormattedDate(data.current.dt, data.timezone);
  })
  .catch(error => {
    console.log('Error fetching weather data:', error);
  });
}


setInterval(() => {
  if(!geoLocation){
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
  
    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
  
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
  }
}, 1000);

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        showWeatherData(data);
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });
  });
}

function showWeatherData(data) {
  let { humidity, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';


  currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>`;

  currentWeatherItems2El.innerHTML =
    `<div class="weather-item2">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item2">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`;

  let otherDayForecast = '';
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon-small">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`;
    } else {
      otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;

   let hourlyForecast = '';
  data.hourly.forEach((hour, idx) => {
    hourlyForecast += `
    <div class="hourly-card">
    <p class="hourly-degree"><strong>${hour.temp}°C</strong></p>
    <i class="fas fa-sun fa-2x mb-3" style="color: #ddd;"></i>
    <p class="mb-0"><strong>${getFormattedTime(hour.dt)}</strong></p>
    <p class="mb-0 text-muted" style="font-size: .65rem;">${getFormattedPeriod(hour.dt)}</p>
    </div>
    `
  })
  document.getElementById('hourly-card').innerHTML = hourlyForecast
}

document.getElementById('button-search').addEventListener('click', function(){
  let searchQuery = document.getElementById('input-search').value;
    geoLocation = searchQuery;
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        let {lat, lon} = data[0]
        latitude = lat;
        longitude = lon;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        showWeatherData(data);
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });

       
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });
})

function getFormattedTime(timestamp) {
  const time = new Date(timestamp * 1000);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getFormattedPeriod(timestamp) {
  const time = new Date(timestamp * 1000);
  const hours = time.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return ampm;
}



function getFormattedDate(timestamp, timezone) {
      let options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: timezone
      };
      let newDate = new Date(timestamp * 1000).toLocaleString('en-US', options);
      let parts = newDate.split(','); // Split the string into parts based on the comma separator
      let dayOfWeek = parts[0].trim(); // Extract the day of the week and trim any leading or trailing spaces
      let monthAndDay = parts[1].trim().split(' '); // Extract the month and day, and split them based on the space separator
      let month = monthAndDay[0]; // Extract the month
      let day = monthAndDay[1]; // Extract the day
      let hour = parseInt(newDate.split(':')[0].split(', ')[3]);
      let hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
      let minutes = parseInt(newDate.split(':')[1]);
      let ampm = newDate.split(' ')[newDate.split(' ').length - 1];
      timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
      dateEl.innerHTML = dayOfWeek+ ', ' + day + ' ' + month;
}


// 49cc8c821cd2aff9af04c9f98c36eb74


