const previous = document.querySelector('#previous')
const next = document.querySelector('#next')

let api_url = 'https://swapi.dev/api/planets/?page=1'

const numbersOfPages = 6
let i = 1
let j = 6


async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data)
    insertData(data)
}

getData(api_url);

next.addEventListener('click', ()=>{
    if(i<6){
        i++;

    }
    api_url = `https://swapi.dev/api/planets/?page=${i}`
    console.log(api_url)
    getData(api_url).then()

})


previous.addEventListener('click', ()=>{
    if(i>1){
        i--;
    }
    api_url = `https://swapi.dev/api/planets/?page=${i}`
    console.log(api_url)

    getData(api_url).then()


})



function insertData(data){
    let tab = '';

    for(const item of data.results){
        if(isNaN(item.surface_water)){
            item.surface_water = 'unknown'
        }else{
            item.surface_water += '%'

        }
        if(isNaN(item.population)){
            item.population = 'unknown'
        }else{
            item.population = parseFloat(item.population).toLocaleString('en') +' people'

        }
        if(isNaN(item.diameter)){
            item.diameter = 'unknown'
        }else{
            item.diameter = parseFloat(item.diameter).toLocaleString('en') +' km'

        }
         if (item.residents.length<=0) {
            item.residents = 'No known residents'
        } else {
            item.residents = item.residents.length + " resident(s)"
        }
        // console.log(item.residents)
        tab += "<tr>";
        tab += "<td>" + item.name + "</td>";
        tab += "<td>" + item.diameter+"</td>";
        tab += "<td>" + item.climate + "</td>";
        tab += "<td>" + item.terrain + "</td>";
        tab += "<td>" + item.surface_water +"</td>";
        tab += "<td>" + item.population  +"</td>";
        tab += "<td>" + item.residents + "</td>";
}
    document.getElementById("data").innerHTML = tab;

}


