import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-aio';

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput() {
    countryInfo.innerHTML = '';
    list.innerHTML = '';
    const country = input.value.trim();
    if (!country) {
        Notify.warning('Please enter the name of the country');
        return;
    }
    fetchCountries(country)
    .then(country => {
        if (country.length === 1) {
            renderCountry(country)
        } else {
            renderList(country)
        }
    })
    .catch(error => {
        if (country.length !== 1) {
            Notify.warning('Oops, there is no country with that name')
            return;
        }
    })
}



function renderList(country) {
    if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.')
        return;
    }
    let markup = country
        .map(element => {
            return `<li>
            <img src="${element.flags.svg}" height="20px" width="40px">
            <p class="text">${element.name.official}</p>
          </li>`;
        })
        .join('');
        list.innerHTML = markup;
}



function renderCountry(country) {
    if (country.length === 1) {
        list.innerHTML = '';
        const newMarkup = `
        <div class="country-name">
        <img src="${[country[0].flags.svg]}" alt="${[country[0].name.official]}" height="30px" width="60px">
        <h1>${[country[0].name.official]}</h1>
        </div>
        <ul>
          <li>Capital:${country[0].capital}</li>
          <li>Population:${country[0].population}</li>
          <li><b>Languages:${Object.values(country[0].languages)}</b></li>
        </ul>`;
        countryInfo.innerHTML = newMarkup;
    }
}