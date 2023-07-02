import conditions from "./conditions.js";

const apiKey = "4a959e1843174e66898125555230207";

/*Элементы на странице*/
const header = document.querySelector(".header");
const weatherFrom = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");

/*Удаляем предыдущую карточку*/
function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) {
    prevCard.remove();
  }
}

/*Карточка с ошибкой*/
function showError(errorMessage) {
  //Разметка для карточки c ошибкой
  const html = `<div class="card">${errorMessage}</div>`;

  //Отображаем карточку с ошибкой на странице
  header.insertAdjacentHTML("afterend", html);
}

function showCard({ name, country, temp, condition, imgPath }) {
  //Разметка для карточки
  const html = `
    <div class="card">
      <h2 class="card__city">${name} <span>${country}</span></h2>
       <div class="card__weather">
          <p class="card__value">${temp}<sup>°c</sup></p>
          <img class="card__img" src="${imgPath}" alt="Weather">
      </div>
      <p class="card__descr">${condition}</p>
    </div>
  `;

  //Отображаем карточку на странице
  header.insertAdjacentHTML("afterend", html);
}

/*Получаем данные с серсвера*/
async function getWeather(city) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

/*Слушаем отправку формы*/
weatherFrom.onsubmit = async function (e) {
  //Отменяем отправку формы
  e.preventDefault();

  //Берем значение из инпута, обрезаем пробелы
  let city = cityInput.value.trim();

  const data = await getWeather(city);

  /*Проверка на ошибку*/
  if (data.error) {
    //Если есть ошибка
    removeCard();
    showError(data.error.message);
  } else {
    //Если нет ошибки
    removeCard();

    
    //Ищем код города
    const info = conditions.find(function (obj) {
        if (obj.code === data.current.condition.code) return true;
    });

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? info.day : info.night) + ".png";
    const imgPath = filePath + fileName;

    //Создаем объект под данные
    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day ? info.languages[23]["day_text"] : info.languages[23]["night_text"],
      imgPath: imgPath
    };

    showCard(weatherData);
  }
};
