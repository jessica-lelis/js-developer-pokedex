
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
//   console.log(pokeDetail)
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
  //  console.log(pokemon)
    return pokemon
    
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json()) // a resposta dos detalhes é convertida para json
        .then(convertPokeApiDetailToPokemon) // com estes detalhes é chamada uma função que vai converter esses detalhes no model Pokemon que foi criado
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())  // traz o resultado do get na url da api e já convertido para json
        .then((jsonBody) => jsonBody.results) // pega apenas o valor do 'results' do json
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // com o results transforma essa lista (através do map) fazendo outra requisição para trazer os detalhes
        .then((detailRequests) => Promise.all(detailRequests)) // espera o retorno através de uma chamada assíncrona (promisse)
        .then((pokemonsDetails) => pokemonsDetails) // retorna o detalhe dos pokemons 
}


pokeApi.getPokemonsD = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`

    return fetch(url)
        .then((response) => response.json())  
        
}
