'use strict';

import { STAR_WARS_API_URL } from './constants.js';

// let characterContainer;

async function fetchJSON(url) {
    try
    {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from (${response.status})`);
        }
        return await response.json();
    } catch (err) {
            console.error(err);
    }
}

async function getStarWarsData() {
    const starWarsData = await fetchJSON(STAR_WARS_API_URL);
    return starWarsData;
}

// creating dropdown list to select character
function createCharacterSelect(characters) {
    const charactersContainer = document.createElement('div');
    const starWarsElement = document.createElement('select');
    charactersContainer.appendChild(starWarsElement);
    console.log(characters);
    characters.forEach((character) => {
      const option = document.createElement('option');
      option.value = character.id;
      option.innerText = character.name;
      starWarsElement.appendChild(option);
    });
  
    document.body.appendChild(charactersContainer);
    return starWarsElement;
}

// creating search bar to search for a character
function createCharacterSearch(characters) {
    const searchContainer = document.createElement('div');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for a character...';
    searchContainer.appendChild(searchInput);
  
    searchInput.addEventListener('input', (event) => {
      const searchValue = event.target.value.toLowerCase();
      const filteredCharacters = characters.filter((character) => {
        return character.name.toLowerCase().includes(searchValue);
      });
        const btn = document.createElement('button');
        btn.innerHTML = "Search";
        searchContainer.appendChild(btn);
        btn.addEventListener('click', async () => {
            await showCharacterInfo(filteredCharacters[0].id);
        });
    });
  
    document.body.appendChild(searchContainer);
    return searchInput;
}

// creating a button to show random character
async function showRandomCharacterInfo(characters) {
    const randomCharacterButton = document.createElement('button');
    randomCharacterButton.innerText = 'Surprise Me!';
    document.body.appendChild(randomCharacterButton);
    randomCharacterButton.addEventListener('click', async () => {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        return await showCharacterInfo(randomCharacter.id);
    });
   
}

// card list of characters
async function displayCharacters(characters) {

    const cardView = document.createElement('div');
    cardView.style.display = 'flex';
    cardView.style.flexWrap = 'wrap';

    console.log(characters);
    characters.forEach((character) => {

        const card = document.createElement('div');
        card.style.border = '1px solid black';
        card.style.margin = '10px';
        card.style.padding = '10px';

        const cardImage = document.createElement('img');
        cardImage.src = character.image;
        cardImage.alt = character.name;
        cardImage.style.borderRadius = '20%';
        cardImage.style.border = '10px solid black';
        card.appendChild(cardImage);

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = character.name;
        card.appendChild(cardTitle);

        const cardButton = document.createElement('button');
        cardButton.innerText = 'View Details';
        cardButton.addEventListener('click', async () => {
            console.log(character);
            await showCharacterInfo(character.id);
        });
        card.appendChild(cardButton);

        cardView.appendChild(card);
    });
    document.body.appendChild(cardView);
}


// displaying character information
async function showCharacterInfo(selectedCharacterId) {
    const characterInfo = await fetchJSON(`https://akabab.github.io/starwars-api/api/id/${selectedCharacterId}.json`);
    
    const characterContainer = document.createElement('div');
    characterContainer.innerHTML = `
      <h2>${characterInfo.name}</h2>
      <p>Height: ${characterInfo.height} m</p>
      <p>Weight: ${characterInfo.mass} kg</p>
      <p>Hair Color: ${characterInfo.hairColor}</p>
      <p>Skin Color: ${characterInfo.skinColor}</p>
      <p>Eye Color: ${characterInfo.eyeColor}</p>
      <p>Birth Year: ${characterInfo.born}</p>
      <p>Gender: ${characterInfo.gender}</p>
      <p>Homeworld: ${characterInfo.homeworld}</p>
      <p>Species: ${characterInfo.species}</p>
      <p>Affiliations: ${characterInfo.affiliations}</p>
      <p>Image: </p>
      <img src="${characterInfo.image}" alt="${characterInfo.name}" />
      <p>More Info: <a href="${characterInfo.wiki}" target="_blank">${characterInfo.name}</a></p>
    `;
    
    const existingContainer = document.querySelector('div');
    if (existingContainer) {
      existingContainer.remove();
    }
    document.body.appendChild(characterContainer);
}
  
async function main() {
    const characters = await getStarWarsData();
    createCharacterSearch(characters);
    showRandomCharacterInfo(characters);
    displayCharacters(characters);
    const characterSelect = createCharacterSelect(characters);
    characterSelect.addEventListener('change', async (event) => {
        await showCharacterInfo(event.target.value);
    });
}
window.addEventListener('load', main);