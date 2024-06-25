'use strict';

import { STAR_WARS_API_URL } from './constants.js';

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

// setting timeout for search so it will not search for every key press
let searchTimeoutToken = 0;

// creating search bar to search for a character
function createCharacterSearch(characters) {
    const searchContainer = document.createElement('div');
    const searchInput = document.createElement('input');

    searchContainer.className = 'search-container';

    searchInput.className = 'search-input';
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search for a character...';

    searchContainer.appendChild(searchInput);

    const btn = document.createElement('button');
    btn.classList.add('action-button');
    btn.innerHTML = "Search";
    searchContainer.appendChild(btn);
    searchInput.onkeyup = (event) => { 
        clearTimeout(searchTimeoutToken);
        searchTimeoutToken = setTimeout(() => {
            const searchValue = event.target.value.toLowerCase();
            const filteredCharacters = characters.filter((character) => {
                return character.name.toLowerCase().includes(searchValue);
            });
            if (filteredCharacters.length > 0) {
            }
            btn.addEventListener('click', async () => {
                await showCharacterInfo(filteredCharacters[0].id);
            });
        }, 250);
    };  
    document.body.appendChild(searchContainer);
}

// creating a button to show random character
async function showRandomCharacterInfo(characters) {
    const randomCharacterButton = document.createElement('button');
    randomCharacterButton.innerText = 'Surprise Me!';
    randomCharacterButton.className = 'surprise-button';
     document.body.appendChild(randomCharacterButton);
    randomCharacterButton.addEventListener('click', async () => {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        return await showCharacterInfo(randomCharacter.id);
    });
   
}

// card list of characters
async function displayCharacters(characters) {

    const cardView = document.createElement('div');
    cardView.className = 'card-container';
    characters.forEach((character) => {

        const card = document.createElement('div');
        card.className = 'card';
        const cardImage = document.createElement('img');
        cardImage.src = character.image;
        cardImage.alt = character.name;
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
    const age = Math.abs(characterInfo.born) + characterInfo.died ? `${Math.abs(characterInfo.born - characterInfo.died)} Years` : 'Unknown';
    const hairColor = characterInfo.hairColor ? characterInfo.hairColor : 'Unknown';
    const skinColor = characterInfo.skinColor ? characterInfo.skinColor : 'Unknown';
    const characterCard = document.createElement('div');
    characterCard.id = 'character-card';
    characterCard.className = 'information-card';

    characterCard.innerHTML = `
        <h2>${characterInfo.name}</h2>
        <img src="${characterInfo.image}" alt="${characterInfo.name}" />
        <p>Height: ${characterInfo.height} m</p>
        <p>Weight: ${characterInfo.mass} kg</p>
        <p>Hair Color: ${hairColor}</p>
        <p>Skin Color: ${skinColor}</p>
        <p>Eye Color: ${characterInfo.eyeColor}</p>
        <p>Age: ${age}</p>
        <p>Gender: ${characterInfo.gender}</p>
        <p>Homeworld: ${characterInfo.homeworld ? characterInfo.homeworld : "Unknown"}</p>
        <p>Species: ${characterInfo.species}</p>
        <p>Affiliations: ${characterInfo.affiliations}</p>
        <p>More Info: <a href="${characterInfo.wiki}" target="_blank">${characterInfo.name}</a></p>
    `;
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';

    closeButton.addEventListener('click', () => {
        characterCard.remove();
    });
    characterCard.appendChild(closeButton);
    characterCard.addEventListener('click', (event) => {
        if (event.target === characterCard) {
            characterCard.remove();
        }
    });
    document.body.appendChild(characterCard);
    const existingContainer = document.querySelector('div');
    if (existingContainer) {
      existingContainer.remove();
    }
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