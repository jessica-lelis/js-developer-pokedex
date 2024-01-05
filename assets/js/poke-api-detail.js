const pokemonListDetails = document.getElementById('pokemonListDetails')

const pokeApiDetail = {}

function convertPokeApiDetailToPokemonDetail(pokeDetail) {
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

////////// traz o detalhe de um Pokemon ////////////////////

pokeApiDetail.getPokemonDetailById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`

    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemonDetail)
}


////////// Faz o html do detalhe do Pokemons////////////////////

function convertPokemonToDetail(pokemon) {
    return `
        <div class="detail-top ${pokemon.type}">
            <button type="button" onclick="returnButton()"> Pokedex </button>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
                <div class="detail_name">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                </div>
        </div>
        <div class="stats">
            <span class="types li-details">${pokemon.types.map((type) => `<li class="type ${type} pokemon">${type}</li>`).join('')}</span>
        </div>
        <div class="kg">
            <div class="kg-mt">
                <span>${pokemon.weight} KG</span>
                <span class="h-w">weight</span>
            </div>
            <div class="kg-mt">
                <span>${pokemon.height} M</span>
                <span class="h-w">height</span>
            </div>
        </div> 
                
                <span class="base_stats title">Base Stats</span>
        <div class="base_stats">
        
                <ol class="ol-stats">${pokemon.stats.map((stats) => `<li class="li-stats"> ${stats} </li>`).join('')}</ol>
                <ol class="ol-stats">${pokemon.base_stat.map((base_stat) => `<li class="li-stats-num">${base_stat}</li>`).join('')}</ol>   
        </div>
        <span class="base_stats title">Experience: ${pokemon.exp}</span>

    `
}


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    pokeApiDetail.getPokemonDetailById(pokemonId).then((pokemon) => {
        console.log(pokemon)
        const newHtml2 = convertPokemonToDetail(pokemon);
        pokemonListDetails.innerHTML = newHtml2;

    });
});

function returnButton() {
    window.location.href = "/";
}

