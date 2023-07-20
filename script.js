const loader = document.querySelector(".loader-container");
const errorInformation = document.querySelector(".error-information");
const apiKeys = "d83df634-0800-445a-b45d-ed0dedfb40b3";

getGeolocalisation()

async function getGeolocalisation() {
    let url = `https://api.airvisual.com/v2/nearest_city?key=${apiKeys}`
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            url = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${apiKeys}`
            getWeatherData(url)
        }, async function (error) {
            console.log("Geolocation is not allowed by this browser, using IP.")
            getWeatherData(url)
        })
    } else {
        console.log("Geolocation is not supported by this browser.")
        getWeatherData(url)
    }
}

async function getWeatherData(url){
    try {
        const response = await fetch(url)

        console.log(response)
        if (!response.ok) {
            throw new Error(`Error ${response.status} : ${response.statusText}`)
        }

        const responseData = await response.json()

        const sortedData = {
            city: responseData.data.city,
            country: responseData.data.country,
            iconId: responseData.data.current.weather.ic,
            temperature: responseData.data.current.weather.tp,
            localisation: {
                latitude: responseData.data.location.coordinates[0],
                longitude: responseData.data.location.coordinates[1]
            }
        }

        populateUI(sortedData)
    }
    catch (error) {
        loader.classList.remove("active");
        errorInformation.textContent = error.message;
    }
}


const cityName = document.querySelector(".city-name");
const countryName = document.querySelector(".country-name");
const temperature = document.querySelector(".temperature");
const infoIcon = document.querySelector(".info-icon");

function populateUI(data){
    cityName.textContent = data.city;
    countryName.textContent = data.country;
    temperature.textContent = data.temperature + "°C"
    infoIcon.src = `./ressources/icons/${data.iconId}.svg`;
    infoIcon.style.width = "150px";
    infoIcon.style.height = "150px";

    loader.classList.remove("active");
}
