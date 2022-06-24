const previous = document.querySelector('#prev');
const next = document.querySelector('#next');
let api_url = "https://swapi.py4e.com/api/planets/";
let next_url = "";
let previous_url = "";
let allPlanetsResidents = [];
const voteButton = document.querySelectorAll(".vote")


async function getData(url) {
    const response = await fetch(url);
    let data = await response.json();
    next_url = data['next']
    previous_url = data['previous']
    insertData(data['results']);
    for (let planet of data['results']) {
        const response2 = await fetch(planet['url']);
        let data2 = await response2.json();
        // console.log(data2);
        allPlanetsResidents.push(data2['url'])
    }
    // console.log(allPlanetsResidents);
}

getData(api_url).then();

next.addEventListener('click', () => {
    if (next_url){
        getData(next_url).then();
        saveVotes(next_url)
    }
});
previous.addEventListener('click', () => {
    if (previous_url) {
        getData(previous_url).then();
        saveVotes(previous_url)
    }
});


const saveToStorage = document.querySelector('#saveToStorage')

function saveUserToSession(){
    let userSession = document.querySelector('#username')
    window.sessionStorage.setItem('username',userSession.value)

}


function logOut(){
    window.sessionStorage.removeItem('username')
}

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
        }
        if (sessionStorage.getItem('username') != null) {
            //redirect to page
            console.log('You are logged in');
        } else{
            //show validation message
          console.log('You are not logged in');
        }

        planetsTable += "<tr>";
        planetsTable += "<td>" + planet.name + "</td>";
        planetsTable += "<td>" + planet.diameter +"</td>";
        planetsTable += "<td>" + planet.climate + "</td>";
        planetsTable += "<td>" + planet.terrain + "</td>";
        planetsTable += "<td>" + planet.surface_water + "</td>";
        planetsTable += "<td>" + planet.population +"</td>";
        planetsTable += "<td>" + planet.residents + "</td>";
        if (window.sessionStorage.getItem('username')){
            // console.log('You are logged in');
            planetsTable += `<td><button onclick="votePlanet('${planet.url}','${planet.name}')" type="button" class="btn btn-secondary btn-sm vote" >` + 'Vote' + `</button></td>`;
        }
        planetsTable += "</tr>";
    }
    document.querySelector('#data').innerHTML = planetsTable;
}

function votePlanet(url,name){
    let id = url.split('planets/')[1].substring(0,1)
    // console.log(id)
    let data = {id: id,
        name: name}
    // console.log(data)
    sentVote(data)

}

async function sentVote(data) {

    fetch('/vote', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}



async function insertResidents(planetUrl, planetName) {
    let peopleDetails = [];
    for (let resident of allPlanetsResidents) {
        if (resident === planetUrl) {
            // console.log('merge');
            const response3 = await fetch(resident);
            const residentDetails = await response3.json();
            for (let residentDetail of residentDetails['residents']) {
                const response4 = await fetch(residentDetail);
                const details = await response4.json();
                // console.log(details);
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

async function saveVotes(url){
    listOfPlanets = []
    const response = await fetch(url)
    let test = await response.json()
    for(let item of test['results']){
        listOfPlanets.push(item['name'])
    }
    console.log(listOfPlanets);
}

saveVotes(api_url)


async function getStatistics(){
    const reponse = await fetch('/api/statistics')
    let data = await reponse.json()
    insert_statistics(data)
    console.log('Data from server:',data)
}

getStatistics()

const statisticsButton = document.querySelector('#statistics')

statisticsButton.addEventListener('click',getStatistics)


function insert_statistics(data){
    let statTable = ''
    for(let vote of data){
        statTable += "<tr>";
        statTable += "<td>" + vote.planet_name + "</td>";
        statTable += "<td>" + vote.count + "</td>";
         statTable += "</tr>";

    }
        document.querySelector('#planetCount').innerHTML = statTable;

}