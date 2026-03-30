const container = document.getElementById("pokemonList");
const screen = document.getElementById("topScreen");
const search = document.getElementById("searchPokemon");
const searchButton = document.getElementById("btnSearch");
const preview = document.getElementById("pkmnPreview");
let currentPokemon = null;
let view = "main";

async function getPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=900");
    const data = await response.json();

    data.results.forEach(pokemon => {
        const pokemonBtn = document.createElement("button");
        pokemonBtn.textContent = pokemon.name;


        pokemonBtn.addEventListener("click", async () => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();


            currentPokemon = pokemonData;
            view = "main";
            renderPokemon();

            preview.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" width="120">`;
        })
        container.appendChild(pokemonBtn);
    });
}

async function showPokemon(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data = await response.json();

        currentPokemon = data;
        currentView = "main";
        renderPokemon();

        preview.innerHTML = `
        <img src="${data.sprites.front_default}" width="120">
`;


    }
    catch (error) {
        screen.innerHTML = `<p style="color:red;">Pokemon no encontrado</p>`;
    }

}

searchButton.addEventListener("click", () => {
    const value = search.value.trim();

    if (value !== "") {
        showPokemon(value);
    }
})

search.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchButton.click();
    }
})

function renderPokemon() {
    if (!currentPokemon) return;

    if (view === "main") {
        screen.innerHTML = `
        <div class="pokemon"> 
            <img src="${currentPokemon.sprites.front_default}" width="200px">
        </div>

        <div class="infoPokemon"> 
            <h2 id="name">#${currentPokemon.id} ${currentPokemon.name}</h2>

            <div class="information">
                <div class="dataTitle">
                    <p>type:</p>
                    <p>Height:</p>
                    <p>Weight:</p>
                    <p>XP:</p>
                </div>

                <div class="dataPkmn">
                    <p>${currentPokemon.types.map(t => t.type.name).join(', ')}</p>
                    <p>${currentPokemon.height}</p>
                    <p>${currentPokemon.weight}</p>
                    <p>${currentPokemon.base_experience}</p>
                </div>
            </div>
        </div>
        `;
    }

   if (view === "extra") {
    screen.innerHTML = `
        <div class="pokemon"> 
            <img src="${currentPokemon.sprites.front_shiny}" width="200px">
        </div>

        <div class="infoPokemon"> 
            <h2 id="name">${currentPokemon.name} estadisticas</h2>

            <div class="information">
                <div class="dataTitle">
                    ${currentPokemon.stats.map(stat => `
                        <p>${stat.stat.name}</p>
                    `).join('')}
                </div>

                <div class="dataPkmn">
                    ${currentPokemon.stats.map(stat => `
                        <p>${stat.base_stat}</p>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}
}

const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", () => {
    if (!currentPokemon) return;

    view = view === "main" ? "extra" : "main";

    renderPokemon();
});
getPokemon();