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
            <h2 class="home-title">Bienvenido, joven padawan.</h2>
            <p>Usa la navegación de arriba para explorar el universo de Star Wars.</p>
            <p>Toda la información es traída desde la <a href="https://swapi.dev/" target="_blank">SWAPI</a>.</p>
            <p>Los datos que consultes se guardarán en <strong>localStorage</strong> (persistencia) para que la próxima vez carguen al instante.</p>
        </div>
    `;
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
            titleIconSrc = '/icons/film.png';
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
            
            <h2 class="content-title-with-icon">
                <img src="/logo-w.png" class="logo-in-content-title" alt="logo" />
                ${title}
            </h2>
            <ul>
                ${detailList}
            </ul>
        </div>
    `;
}


function router() {
    const path = window.location.hash.slice(1).toLowerCase() || '/';
    document.querySelectorAll('#navList a').forEach(a => a.classList.remove('active'));
    if (path === '/') {
        renderHome();
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