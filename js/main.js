import tabJoursEnOrdre from "./gestionTemps.js";


const CLEFAPI = '8e965f7b446633be438a7eaff27ef635';
let resultatsAPI;
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursNom = document.querySelectorAll('.jour-prevision-nom');
const joursTemps = document.querySelectorAll('.jours-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
   
        let long = position.coords.longitude; 
        let lat = position.coords.latitude;
        AppeAPI(long, lat);

    }, () => {
        alert(`vous avez refusé la geolocalisation, l'application ne peut pas fonctionner, veuiller l'activer`);
    })
}

function AppeAPI(long, lat){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((response) =>{
        return response.json();
    })
    .then((data) =>{
        resultatsAPI = data;
        console.log(resultatsAPI);
        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
        localisation.innerText = resultatsAPI.timezone;
    
// heure 
        let heureActuelle = new Date().getHours();
        for(let i = 0; i < heure.length; i++){
           let heureIncr = heureActuelle + i * 3;
           if(heureIncr > 24){
               heure[i].innerText = `${heureIncr - 24} h`;
           }else if(heureIncr === 24){
               heure[i].innerText = "00 h";
           }else{
            heure[i].innerText = `${heureIncr} h`;
           }
        }

// temperature 
        
        for(let j = 0; j < tempPourH.length; j++){
            tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`;
        }


// jours 
       
        for(let k = 0; k < tabJoursEnOrdre.length; k++){
            joursNom[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }

        for(let m = 0; m < joursTemps.length; m++){
            joursTemps[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
        }

        // icone dynamique 

        if(heureActuelle >= 6 && heureActuelle < 21){
            imgIcone.src = `img/jour/${resultatsAPI.current.weather[0].icon}.svg`
        }else{
            imgIcone.src = `img/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }

// Animation 

chargementContainer.classList.add('disparition');
    })
}