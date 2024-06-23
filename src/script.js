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
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search for a character...';
    searchContainer.style.display = 'block';
    searchContainer.style.padding = '10px';
    searchContainer.style.width = '15%';
    searchContainer.style.margin = 'auto';
    searchInput.style.width = '92%';
    searchInput.style.borderRadius = '5px';
    searchInput.style.padding = '10px';
    searchInput.style.fontSize = '15px';

    searchContainer.appendChild(searchInput);
    const btn = document.createElement('button');
    btn.innerHTML = "Search";
    btn.style.backgroundColor = '#2e557c';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '10px';
    btn.style.borderRadius = '5px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.style.width = '100%';
    btn.style.display = 'block';
    btn.style.margin = 'auto';
    btn.style.marginTop = '10px';
    btn.style.textAlign = 'center';
    btn.style.fontSize = '15px'; 
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
    randomCharacterButton.style.backgroundColor = '#2e557c';
    randomCharacterButton.style.color = 'white';
    randomCharacterButton.style.border = 'none';
    randomCharacterButton.style.padding = '10px';
    randomCharacterButton.style.borderRadius = '5px';
    randomCharacterButton.style.fontSize = '15px';
    randomCharacterButton.style.fontWeight = 'bold';
    randomCharacterButton.style.cursor = 'pointer';
    randomCharacterButton.style.width = '15%';
    randomCharacterButton.style.height = '45px';
    randomCharacterButton.style.display = 'block';
    randomCharacterButton.style.margin = 'auto';
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
    cardView.style.justifyContent = 'center';
    characters.forEach((character) => {

        const card = document.createElement('div');
        card.style.border = '1px solid black';
        card.style.margin = '10px';
        card.style.padding = '10px';
        card.style.width = '200px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.borderRadius = '5px';
        card.style.backgroundColor = '#381010';

        const cardImage = document.createElement('img');
        cardImage.src = character.image;
        cardImage.alt = character.name;
        cardImage.style.borderRadius = '10%';
        cardImage.style.width = '200px';
        cardImage.style.height = '200px';
        card.appendChild(cardImage);

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = character.name;
        cardTitle.style.color = '#ad7d37';
        cardTitle.style.textAlign = 'center';
        cardTitle.style.margin = '10px';
        cardTitle.style.fontFamily = 'Arial';
        cardTitle.style.fontSize = '15px';
        card.appendChild(cardTitle);

        const cardButton = document.createElement('button');
        cardButton.innerText = 'View Details';
        cardButton.style.backgroundColor = '#2e557c';
        cardButton.style.color = 'white';
        cardButton.style.border = 'none';
        cardButton.style.padding = '10px';

        cardButton.style.borderRadius = '5px';
        cardButton.style.fontFamily = 'Arial';
        cardButton.style.fontSize = '15px';
        cardButton.style.fontWeight = 'bold';
        cardButton.style.textAlign = 'center';
        cardButton.style.width = '100%';

        cardButton.style.cursor = 'pointer';
        cardButton.style.alignSelf = 'center';
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
    characterCard.style.position = 'fixed';
    characterCard.style.top = '50%';
    characterCard.style.left = '50%';
    characterCard.style.width = '400px';
    characterCard.style.maxHeight = '80%';
    characterCard.style.transform = 'translate(-50%, -50%)';
    characterCard.style.backgroundColor = '#334e30';
    characterCard.style.border = '1px solid black';
    characterCard.style.padding = '20px';
    characterCard.style.zIndex = '9999';

    characterCard.innerHTML = `
        <h2>${characterInfo.name}</h2>
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
    closeButton.style.backgroundColor = '#2e557c';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px';
    closeButton.style.width = '100%';

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