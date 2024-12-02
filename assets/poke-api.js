const pokeApi = {};

// Classe para representar o Pokémon
class poke {
    constructor() {
        this.number = null;
        this.name = null;
        this.types = [];
        this.type = null;
        this.photo = null;
    }
}

// Função para converter os detalhes da API em um objeto Pokemon
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites?.other?.dream_world?.front_default || 'https://via.placeholder.com/150';

    return pokemon;
}

// Função para buscar os detalhes de um Pokémon
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
};

// Função para buscar uma lista de Pokémon
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => Promise.all(pokemons.map(pokeApi.getPokemonDetail)))
        .catch((err) => {
            console.error("Error fetching Pokémon list or details:", err);
            return [];
        });
};

// Função para exibir os Pokémon no HTML
function displayPokemons(pokemons) {
    const pokemonList = document.getElementById("pokemonList");

    // Limpar lista antes de atualizar
    pokemonList.innerHTML = "";

    pokemons.forEach((pokemon) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <p>#${pokemon.number} - ${pokemon.name}</p>
            <p>Type: ${pokemon.type}</p>
        `;
        pokemonList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    pokeApi.then(displayPokemons); // Começa no 11º Pokémon
});



