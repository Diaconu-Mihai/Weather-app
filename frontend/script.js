// Creare de search bar
const searchBarSection = document.createElement('div');
searchBarSection.classList.add('search-bar-section');

const inputElement = document.createElement('input');
inputElement.setAttribute('type', 'text');
inputElement.setAttribute('id', 'cityInput');
inputElement.setAttribute('placeholder', 'Enter a city');

const autocompleteList = document.createElement('ul');
autocompleteList.setAttribute('id', 'autocompleteList');
autocompleteList.classList.add('autocomplete-list');

inputElement.addEventListener('input', handleInputChange);
autocompleteList.addEventListener('click', handleAutocompleteSelection);

searchBarSection.appendChild(inputElement);
searchBarSection.appendChild(autocompleteList);

// Dispay de weather
const weatherDisplaySection = document.createElement('div');
weatherDisplaySection.setAttribute('id', 'weatherCard');

// Append la root
const rootElement = document.getElementById('root');
rootElement.appendChild(searchBarSection);
rootElement.appendChild(weatherDisplaySection);

function createAutocompleteItem(city) {
  const item = document.createElement('li');
  item.textContent = city;
  return item;
}

function fetchWeatherData(city) {
  const apiKey = 'c0591d0d817045fc97e61824232705';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const { temp_c, condition, humidity } = data.current;

      const weatherCardHTML = `
        <div class="weather-card">
          <h2>${city}</h2>
          <p>Temperature: ${temp_c}Â°C</p>
          <p>Sky Conditions: ${condition.text}</p>
          <p>Humidity: ${humidity}%</p>
        </div>
      `;

      const weatherCard = document.getElementById('weatherCard');
      weatherCard.innerHTML = weatherCardHTML;

      // Sa arate search bar dupa cautari
      searchBarSection.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      const weatherCard = document.getElementById('weatherCard');
      weatherCard.textContent = 'Failed to fetch weather data. Please try again';

      // Sa arate search bar dupa erori
      searchBarSection.style.display = 'block';
    });
}

function handleInputChange(event) {
  const input = event.target;
  const inputValue = input.value.trim();
  const autocompleteList = document.getElementById('autocompleteList');
  autocompleteList.innerHTML = '';

  if (inputValue.length >= 3) {
    const apiKey = 'c0591d0d817045fc97e61824232705';
    const autocompleteUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(inputValue)}`;

    fetch(autocompleteUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const city = item.name;
          const listItem = createAutocompleteItem(city);
          autocompleteList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error fetching autocomplete data:', error);
      });
  }
}

function handleAutocompleteSelection(event) {
  const selectedCity = event.target.textContent;
  const input = document.getElementById('cityInput');
  input.value = selectedCity;
  fetchWeatherData(selectedCity);

  //cand se incarca -hide
  searchBarSection.style.display = 'none';
}