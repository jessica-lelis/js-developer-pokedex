const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 20;
let offset = 0;

const pokeApi = {}

function convertPokemonToLi(pokemon) {
    return `
    <button class="pokemon-button" type="button" onclick="detailsButton(${pokemon.number})">
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>   
        </button>
    `
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()

    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types  // esse é um "Destructuring assignment", onde é possível pegar o valor da posição principal [0] da lista
    pokemon.types = types
    pokemon.type = type

    const stats = pokeDetail.stats.map((baseStats) => baseStats.stat.name)
    pokemon.stats = stats
    const base_stats = pokeDetail.stats.map((baseStats) => baseStats.base_stat)
    pokemon.base_stat = base_stats

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.exp = pokeDetail.base_experience

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon

}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json()) // a resposta dos detalhes é convertida para json
        .then(convertPokeApiDetailToPokemon) // com estes detalhes é chamada uma função que vai converter esses detalhes no model Pokemon que foi criado
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())  // traz o resultado do get na url da api e já convertido para json
        .then((jsonBody) => jsonBody.results) // pega apenas o valor do 'results' do json
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // com o results transforma essa lista (através do map) fazendo outra requisição para trazer os detalhes
        .then((detailRequests) => Promise.all(detailRequests)) // espera o retorno através de uma chamada assíncrona (promisse)
        .then((pokemonsDetails) => pokemonsDetails) // retorna o detalhe dos pokemons 
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function detailsButton(id) {
    window.location.href = `./detalhes.html?id=${id}`;
}

function returnButton() {
    window.location.href = "/";
}

