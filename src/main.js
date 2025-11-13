import './style.css';

const API_BASE_URL = 'https://swapi.dev/api';
const appContainer = document.getElementById('app');
const navList = document.getElementById('navList');

function getFromCache(key) {
    const data = localStorage.getItem(key);
    if (!data) return null;
    console.log(`Datos obtenidos desde CACHE: ${key}`);
    return JSON.parse(data);
}
function saveToCache(key, data) {
    console.log(`Guardando en CACHE: ${key}`);
    localStorage.setItem(key, JSON.stringify(data));
}

const FAVORITES_KEY = 'swapiFavorites';

function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(category, id) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.category === category && fav.id === id);
}

function addFavorite(category, id, name) {
    const favorites = getFavorites();
    if (!isFavorite(category, id)) {
        favorites.push({ category, id, name });
        saveFavorites(favorites);
        console.log(`Añadido: ${name}`);
    }
}

function removeFavorite(category, id) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => !(fav.category === category && fav.id === id));
    saveFavorites(favorites);
    console.log(`Quitado: ${id}`);
}

function handleFavoriteClick(event) {
    const button = event.currentTarget;
    const iconImg = button.querySelector('img'); 
    const { category, id, name } = button.dataset;
    let isCurrentlyFavorite = button.dataset.isfavorite === 'true';

    if (isCurrentlyFavorite) {
        removeFavorite(category, id);
        iconImg.src = '/icons/sable-off.png';
        button.dataset.isfavorite = 'false';
        button.classList.remove('is-favorite');
    } else {
        addFavorite(category, id, name);
        iconImg.src = '/icons/sable-on.png';
        button.dataset.isfavorite = 'true';
        button.classList.add('is-favorite');
    }
}

async function fetchSWAPI(endpoint) {
    const cacheKey = `swapi-${endpoint.replace('/', '-')}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    console.log(`Buscando en API: ${endpoint}`);
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/`);
        if (!response.ok) {
            throw new Error(`Error en el fetch: ${response.statusText}`);
        }
        const data = await response.json();
        saveToCache(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        appContainer.innerHTML = `<p class="error">Error al cargar datos. Intenta de nuevo más tarde.</p>`;
    }
}
function getIdFromUrl(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
}


function renderLoader() {
    appContainer.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
        </div>
    `;
}

function renderHome() {
    appContainer.innerHTML = `
        <div class="home-view">
        <h2 class="home-title">Bienvenido, joven Padawan</h2>
            
            <p> Esta base de datos es una herramienta para explorar la galaxia usando la información de la SWAPI.</p>
            
            <p>Usa la barra de navegación de arriba para investigar:</p>
            
            <ul class="home-features-list">
                <li>Información detallada sobre <strong>Personajes</strong>, <strong>Planetas</strong>, <strong>Naves</strong> y más.</li>
                <li>Guarda tus datos de misión más importantes (en <strong>Favoritos</strong>) usando el icono del sable de luz.</li>
            </ul>
            
            <p>Ademas esta terminal recuerda tus ultimas consultas, la proxima vez que la abras se caragara la info al instante. Que la Fuerza te acompañe.</p>
        </div>
    `;
}

function renderFavorites() {
    const favorites = getFavorites();

    appContainer.innerHTML = `
        <h2 class="content-title-with-icon" style="text-transform: capitalize;">
            <img src="/icons/sable-on.png" class="logo-in-content-title" alt="Icono Favoritos" />
            Mis Favoritos
        </h2>
    `;

    if (favorites.length === 0) {
        appContainer.innerHTML += '<p>Todavía no has añadido ningún favorito. ¡Busca y pulsa el sable!</p>';
        return;
    }

    const groupedFavorites = favorites.reduce((acc, fav) => {
        const category = fav.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(fav);
        return acc;
    }, {});


    let allSectionsHtml = '';

    Object.entries(groupedFavorites).forEach(([category, items]) => {
        
        let titleIconSrc = '';
        switch (category) {
            case 'people': titleIconSrc = '/icons/robot.png'; break;
            case 'planets': titleIconSrc = '/icons/logo-planets.png'; break;
            case 'films': titleIconSrc = '/icons/films.png'; break;
            case 'species': titleIconSrc = '/icons/logo-species.png'; break;
            case 'vehicles': titleIconSrc = '/icons/logo-vehicle.png'; break;
            case 'starships': titleIconSrc = '/icons/logo-ship.png'; break;
            default: titleIconSrc = '/default.png'; 
        }

        allSectionsHtml += `
            <h2 class="content-title-with-icon" style="text-transform: capitalize; margin-top: 2rem;">
                <img src="${titleIconSrc}" class="logo-in-content-title" alt="${category}" />
                ${category}
            </h2>
        `;

        let cardsHtml = items.map(fav => {
            return `
                <a class="list-item-card glow-hover-default" href="#/${fav.category}/${fav.id}">
                    <h3>${fav.name}</h3>
                    <p>Categoría: ${fav.category}</p>
                </a>
            `;
        }).join('');

        allSectionsHtml += `
            <div class="list-view-container">
                ${cardsHtml}
            </div>
        `;
    });

    appContainer.innerHTML += allSectionsHtml;
}


async function renderList(category) {
    renderLoader();
    const data = await fetchSWAPI(category);
    
    if (!data || !data.results) {
        appContainer.innerHTML = `<p class="error">No se pudieron cargar los datos para ${category}.</p>`;
        return;
    }

    let titleIconSrc = '';
    switch (category) {
        case 'people':
            titleIconSrc = '/icons/robot.png'; 
            break;
        case 'planets':
            titleIconSrc = '/icons/logo-planets.png';
            break;
        case 'films':
            titleIconSrc = '/icons/films.png';
            break;
        case 'species':
            titleIconSrc = '/icons/logo-species.png';
            break;
        case 'vehicles':
            titleIconSrc = '/icons/logo-vehicle.png';
            break;
        case 'starships':
            titleIconSrc = '/icons/logo-ship.png';
            break;
        default:
            titleIconSrc = '/default.png'; 
    }


    let cardsHtml = data.results.map(item => {
        const title = item.name || item.title;
        const id = getIdFromUrl(item.url);
        
        let hoverGlowClass = 'glow-hover-default';
        if (category === 'people') {
            switch (item.eye_color) {
                 case 'blue': hoverGlowClass = 'glow-hover-blue'; break;
                 case 'red': hoverGlowClass = 'glow-hover-red'; break;
                 case 'yellow': hoverGlowClass = 'glow-hover-yellow'; break;
                 case 'brown': hoverGlowClass = 'glow-hover-brown'; break;
                 case 'green': hoverGlowClass = 'glow-hover-green'; break;
                 case 'orange': hoverGlowClass = 'glow-hover-orange'; break;
                 case 'hazel': hoverGlowClass = 'glow-hover-hazel'; break;
            }
        }

        
        return `
            <a class="list-item-card ${hoverGlowClass}" href="#/${category}/${id}">
                <h3>${title}</h3>
                ${category === 'people' ? `<p>Nacimiento: ${item.birth_year}</p>` : ''}
                ${category === 'planets' ? `<p>Clima: ${item.climate}</p>` : ''}
                ${category === 'films' ? `<p>Director: ${item.director}</p>` : ''}
                ${category === 'species' ? `<p>Lenguaje: ${item.language}</p>` : ''}
                ${category === 'vehicles' ? `<p>Modelo: ${item.model}</p>` : ''}
                ${category === 'starships' ? `<p>Modelo: ${item.model}</p>` : ''}
            </a>
        `;
    }).join('');

    
    appContainer.innerHTML = `
        <h2 class="content-title-with-icon" style="text-transform: capitalize;">
            <img src="${titleIconSrc}" class="logo-in-content-title" alt="Icono ${category}" />
            ${category}
        </h2>
        <div class="list-view-container">
            ${cardsHtml}
        </div>
    `;
}


async function renderDetail(category, id) {
    renderLoader();
    const data = await fetchSWAPI(`${category}/${id}`);
    if (!data) return;
    
    const title = data.name || data.title;
    
    const isItemFavorite = isFavorite(category, id);
    const favIconSrc = isItemFavorite ? '/icons/sable-on.png' : '/icons/sable-off.png';
    const favButtonClass = isItemFavorite ? 'favorite-button is-favorite' : 'favorite-button';

    const detailList = Object.entries(data)
        .filter(([key, value]) => 
            key !== 'name' && key !== 'title' && key !== 'created' &&
            key !== 'edited' && key !== 'url' && key !== 'homeworld' &&
            !Array.isArray(value)
        )
        .map(([key, value]) => `
            <li><strong>${key.replace('_', ' ')}:</strong> ${value}</li>
        `).join('');

    appContainer.innerHTML = `
        <div class="detail-view">
            <a href="#/${category}" class="back-button">&larr; Volver a ${category}</a>
            
            <button class="${favButtonClass}" id="favButton" 
                    data-category="${category}" 
                    data-id="${id}" 
                    data-name="${title}" 
                    data-isfavorite="${isItemFavorite}">
                <img src="${favIconSrc}" alt="Añadir a Favoritos" />
            </button>
            
            <h2 class="detail-title">${title}</h2>
            
            <ul>
                ${detailList}
            </ul>
        </div>
    `;

    document.getElementById('favButton').addEventListener('click', handleFavoriteClick);
}


function router() {
    const path = window.location.hash.slice(1).toLowerCase() || '/';
    document.querySelectorAll('#navList a').forEach(a => a.classList.remove('active'));
    
    if (path === '/') {
        renderHome();
        return;
    }

    if (path === '/favorites') {
        renderFavorites();
        const activeLink = document.querySelector(`a[href="#/favorites"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        return;
    }

    const parts = path.split('/');
    const category = parts[1];
    const id = parts[2];
    
    const activeLink = document.querySelector(`#navList a[href="#/${category}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    if (id) {
        renderDetail(category, id);
    } else {
        renderList(category);
    }
}


window.addEventListener('hashchange', router);
window.addEventListener('load', router);
document.querySelector('.title').addEventListener('click', () => {
    window.location.hash = '/';
});