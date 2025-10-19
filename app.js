const searchForm = document.getElementById("search-form");
const pokemonInput = document.getElementById("pokemon-input");
const pokedexDisplay = document.getElementById("pokedex-display");
const messageContainer = document.getElementById("message-container");

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

// --- Event Listener para el formulario ---
searchForm.addEventListener("submit", function (event) {
  // Prevenimos que la página se recargue
  event.preventDefault();

  // Obtenemos el valor, lo pasamos a minúsculas y quitamos espacios
  const pokemonNameOrId = pokemonInput.value.toLowerCase().trim();

  if (!pokemonNameOrId) {
    displayMessage("Por favor, ingresa un nombre o ID.", true);
    return;
  }

  // Llamamos a la función que busca en la API
  fetchPokemonData(pokemonNameOrId);
});

async function fetchPokemonData(pokemonNameOrId) {
  // Limpiamos la pantalla y mostramos mensaje de carga
  clearDisplay();
  displayMessage("Buscando...", false);

  try {
    // Hacemos la petición GET a la PokeAPI
    const response = await fetch(API_URL + pokemonNameOrId);

    // Si la respuesta no es OK (ej. 404 No Encontrado)
    if (!response.ok) {
      throw new Error("¡Pokémon no encontrado! Revisa el nombre o ID.");
    }

    // Convertimos la respuesta a JSON
    const pokemonData = await response.json();
    console.log(pokemonData);

    // Si todo salió bien, limpiamos el mensaje y mostramos los datos
    clearMessage();
    displayPokemon(pokemonData);
  } catch (error) {
    // Si hay un error (ej. 404 o error de red), lo mostramos
    clearDisplay();
    displayMessage(error.message, true);
  }
}

function displayPokemon(pokemon) {
  const name = pokemon.name;
  const id = pokemon.id;

  // Usamos el 'artwork oficial' para mejor calidad de imagen
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;

  // Mapeamos el array de tipos a solo sus nombres
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);

  // Mapeamos las estadísticas base
  const stats = {
    hp: pokemon.stats.find((stat) => stat.stat.name === "hp").base_stat,
    attack: pokemon.stats.find((stat) => stat.stat.name === "attack").base_stat,
    defense: pokemon.stats.find((stat) => stat.stat.name === "defense")
      .base_stat,
    speed: pokemon.stats.find((stat) => stat.stat.name === "speed").base_stat,
  };

  // 2. Generar el HTML para los tipos
  const typesHtml = types
    .map((type) => `<span class="type-badge ${type}">${type}</span>`)
    .join(""); // .join('') convierte el array en un string

  // 3. Generar el HTML para las estadísticas
  const statsHtml = `
                <ul id="pokemon-stats">
                    <li><span>HP:</span> <span>${stats.hp}</span></li>
                    <li><span>Ataque:</span> <span>${stats.attack}</span></li>
                    <li><span>Defensa:</span> <span>${stats.defense}</span></li>
                    <li><span>Velocidad:</span> <span>${stats.speed}</span></li>
                </ul>
            `;

  // 4. Crear el HTML final de la tarjeta
  const pokemonHtml = `
                <h2 id="pokemon-name">${name} (#${id})</h2>
                <img id="pokemon-image" src="${imageUrl}" alt="Imagen de ${name}">
                <div id="pokemon-types">
                    ${typesHtml}
                </div>
                ${statsHtml}
            `;

  // 5. Inyectar el HTML en el contenedor
  pokedexDisplay.innerHTML = pokemonHtml;
}

function displayMessage(message, isError = false) {
  messageContainer.textContent = message;
  messageContainer.className = isError ? "error" : "loading";
}

function clearMessage() {
  messageContainer.textContent = "";
  messageContainer.className = "";
}

function clearDisplay() {
  pokedexDisplay.innerHTML = "";
}
