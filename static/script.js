const previous = document.querySelector('#prev');
const next = document.querySelector('#next');
let api_url = "https://swapi.py4e.com/api/planets/";
let next_url = "";
let previous_url = "";
let allPlanetsResidents = [];

async function getData(url) {
    const response = await fetch(url);
    let data = await response.json();
    next_url = data['next']
    previous_url = data['previous']
    insertData(data['results']);
    for (let planet of data['results']) {
        const response2 = await fetch(planet['url']);
        let data2 = await response2.json();
        console.log(data2);
        allPlanetsResidents.push(data2['url'])
    }
    console.log(allPlanetsResidents);
}

getData(api_url).then();

next.addEventListener('click', () => {
    if (next_url){
        getData(next_url).then();
    }
});
previous.addEventListener('click', () => {
    if (previous_url) {
        getData(previous_url).then();
    }
});

function insertData(planets) {
    let planetsTable = '';
    for (let planet of planets) {
        if (isNaN(planet.surface_water)) {
            planet.surface_water = 'unknown'
        } else {
            planet.surface_water += '%'
        }
        if (isNaN(planet.population)) {
            planet.population = 'unknown'
        } else {
            planet.population = parseFloat(planet.population).toLocaleString('en') + ' people'
        }
        if (isNaN(planet.diameter)) {
            planet.diameter = 'unknown'
        } else {
            planet.diameter = parseFloat(planet.diameter).toLocaleString('en') + ' km'
        }
        if (planet.residents.length <= 0) {
            planet.residents = 'No known residents'
        } else {
            planet.residents = `
                <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#modalComponent"
                onclick="insertResidents('${planet.url}', '${planet.name}')">${planet.residents.length} resident(s)</button>
                `;
//             planet.residents = `<button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#exampleModal"
// onclick="insertResidents(`${planet.url}`, `${planet.name})" >
//     ` + planet.residents.length + " resident(s)" + `</button>`
        }
        planetsTable += "<tr>";
        planetsTable += "<td>" + planet.name + "</td>";
        planetsTable += "<td>" + planet.diameter +"</td>";
        planetsTable += "<td>" + planet.climate + "</td>";
        planetsTable += "<td>" + planet.terrain + "</td>";
        planetsTable += "<td>" + planet.surface_water + "</td>";
        planetsTable += "<td>" + planet.population +"</td>";
        planetsTable += "<td>" + planet.residents + "</td>";
        planetsTable += "</tr>";
    }
    document.querySelector('#data').innerHTML = planetsTable;
}


async function insertResidents(planetUrl, planetName) {
    let peopleDetails = [];
    for (let resident of allPlanetsResidents) {
        if (resident === planetUrl) {
            console.log('merge');
            const response3 = await fetch(resident);
            const residentDetails = await response3.json();
            for (let residentDetail of residentDetails['residents']) {
                const response4 = await fetch(residentDetail);
                const details = await response4.json();
                console.log(details);
                peopleDetails.push(details);
            }
        }
    }
    // let hair_color;
     let residentsTable = '';
    for (let resident of peopleDetails) {
        if (resident.hair_color === 'n/a' || resident.hair_color === 'none'){
            resident.hair_color = 'unknown'
        }
        if (resident.gender === 'n/a'){
            resident.gender = 'unknown'
        }
        if (isNaN(resident.mass)) {
            resident.mass = 'unknown'
        } else {
            resident.mass = parseFloat(resident.mass).toLocaleString('en') + ' kg'
        }
        if (isNaN(resident.height)) {
            resident.height = 'unknown'
        } else {
            resident.height = parseFloat(resident.height).toLocaleString('en') + ' m'
        }
        residentsTable += "<tr>";
        residentsTable += "<td>" + resident.name + "</td>";
        residentsTable += "<td>" + resident.height + "</td>";
        residentsTable += "<td>" + resident.mass + "</td>";
        residentsTable += "<td>" + resident.hair_color + "</td>";
        residentsTable += "<td>" + resident.skin_color + "</td>";
        residentsTable += "<td>" + resident.eye_color + "</td>";
        residentsTable += "<td>" + resident.birth_year + "</td>";
        residentsTable += "<td>" + resident.gender + "</td>";
        residentsTable += "</tr>";
    }
    document.querySelector('#resident').innerHTML = residentsTable;
    document.querySelector('.modal-title').innerHTML = "Residents of " + planetName;
}