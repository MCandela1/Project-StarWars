# SART WARS - Explorador de SWAPI

Este proyecto es una aplicación web *frontend* que te permite explorar el universo de Star Wars utilizando la [SWAPI (The Star Wars API)](https://swapi.dev/api/).

Es una aplicación de página única (SPA) creada con JavaScript puro (Vanilla JS) que enruta por *hash* y renderiza vistas dinámicamente. Permite navegar por diferentes categorías, ver detalles de cada ítem y guardar tus entradas favoritas para consultarlas más tarde.


## 🌟 Características

* **Navegación por Categorías:** Explora 6 categorías principales del universo Star Wars: Personajes, Planetas, Películas, Especies, Vehículos y Naves.
* **Iconos Temáticos:** Cada categoría y la sección de favoritos tienen iconos personalizados para una inmersión total.
* **Vista de Detalle:** Haz clic en cualquier tarjeta para ver una lista completa de sus atributos y datos.
* **Sistema de Favoritos (con `localStorage`):**
    * ¡Guarda tus ítems favoritos! Usa el botón del **sable de luz** para añadir o quitar cualquier ítem.
    * El estado (encendido/apagado) del sable de luz brilla con un color rojo Sith y persiste entre visitas.
* **Página de Favoritos Agrupada:** Una sección de "Favoritos" dedicada que organiza todos tus ítems guardados y los agrupa por categoría.
* **Caché de API:** La aplicación guarda las consultas a la API en `localStorage`. Las visitas posteriores a una categoría ya consultada son **instantáneas**.
* **Diseño Personalizado:** Interfaz oscura y temática utilizando la fuente "Star Jedi" para todos los títulos.

## 🛠️ Tecnologías Utilizadas

* **HTML5**
* **CSS3** (Variables, Flexbox, Grid, Animaciones, Filtros `drop-shadow`)
* **JavaScript (ES6+)**
    * Vanilla JS (Sin frameworks)
    * Módulos de ES6
    * `async/await` para llamadas de API
    * `fetch` API
    * `localStorage` API (para Caché y Favoritos)
* **Vite:** Como entorno de desarrollo y compilador.
* **Fuente Externa:** [Star Jedi](https://www.dafont.com/es/star-jedi.font)
* **API:** [SWAPI (The Star Wars API)](https://swapi.dev/api/)



## 📦 Instalación y Uso (con Vite)

Este proyecto fue inicializado con **Vite** y debe ser ejecutado desde la terminal.

1.  **Clonar o descargar el repositorio:**
    Obtén los archivos del proyecto en tu máquina local.

2.  **Abrir en Visual Studio Code:**
    Abre la carpeta raíz del proyecto con VS Code.

3.  **Abrir la Terminal Integrada:**
    Presiona `Ctrl + Shift + Ñ` (o `Ctrl + \``) para abrir la terminal dentro de VS Code.

4.  **Instalar Dependencias:**
    En la terminal, ejecuta el siguiente comando. Esto leerá el archivo `package.json` e instalará Vite y cualquier otra dependencia necesaria.
    ```bash
    npm install
    ```

5.  **Iniciar el Servidor de Desarrollo:**
    Una vez que termine la instalación, ejecuta este comando para iniciar el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```

6.  **Ver la Aplicación:**
    La terminal te mostrará un mensaje indicando que el servidor está corriendo, usualmente en una URL como `http://localhost:5173/`.

    Mantén presionada la tecla `Ctrl` y haz clic en esa URL en la terminal para abrir la aplicación directamente en tu navegador.

## 📁 Estructura del Proyecto
* `/` (Raíz del Proyecto)
    * **public/** (Iconos y assets estáticos)
        * `icons/` (Todos los iconos de la app: sables, categorías, etc.)
        * `default.png`
        * `logo-wars.png`
    * **src/** (Código fuente)
        * `fonts/` (Archivo `Starjedi.ttf`)
        * `main.js` (Lógica principal, router, y renderizado)
        * `style.css` (Todos los estilos)
    * `.gitignore`
    * `index.html` (HTML principal)
    * `package.json` (Dependencias de Vite)
    * `package-lock.json`
    * `README.md` (Esta documentación)