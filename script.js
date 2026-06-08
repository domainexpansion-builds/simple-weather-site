const api = "6K9SP9J2QCLHBDHG6JEVPJEVA";

async function getWeather(location){
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${api}`);
        const rawData = await response.json();
        return rawData;
    } catch(error)
    {
        console.error("Error fetching weather data");
    }

}

function processData(rawData){
    return {
    condition: rawData.currentConditions.conditions,
    tempF: rawData.currentConditions.temp,
    tempC: ((rawData.currentConditions.temp - 32) * 5) / 9, 
    humidity: rawData.currentConditions.humidity,
    resolvedAddress: rawData.resolvedAddress
  };
}

const form = document.querySelector("form");

form.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const locationQuery = data.location;

    if (!locationQuery) return;

    try{
        const rawWeather = await getWeather(locationQuery);

        if(rawWeather && rawWeather.currentConditions){
            const finalData = processData(rawWeather);
            displayData(finalData);
        }
    }catch(error){
        console.error("Failed to handle form submission:", error);
    }
});

function displayData(finalData){
    const container = document.getElementById("data-container");

    container.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("weather-card");

    const locationHeading = document.createElement("h2");
    locationHeading.textContent = finalData.resolvedAddress;

    const conditionPara = document.createElement("p");
    conditionPara.classList.add("condition");
    conditionPara.textContent = `Condition: ${finalData.condition}`;

    const tempPara = document.createElement("p");
    tempPara.classList.add("temperature");
    tempPara.textContent = `Temperature: ${Math.round(finalData.tempF)}°F`;

    tempPara.dataset.tempF = Math.round(finalData.tempF);
    tempPara.dataset.tempC = Math.round(finalData.tempC);
    tempPara.dataset.currentUnit = "F";

    const humidityPara = document.createElement("p");
    humidityPara.textContent = `Humidity: ${finalData.humidity}%`;


    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Display in °C";
    toggleBtn.classList.add("toggle-unit");
    
    toggleBtn.addEventListener("click", () => {
        if (tempPara.dataset.currentUnit === "F") {
        tempPara.textContent = `Temperature: ${tempPara.dataset.tempC}°C`;
        tempPara.dataset.currentUnit = "C";
        toggleBtn.textContent = "Display in °F";
        } else {
        tempPara.textContent = `Temperature: ${tempPara.dataset.tempF}°F`;
        tempPara.dataset.currentUnit = "F";
        toggleBtn.textContent = "Display in °C";
        }
    });

    card.appendChild(locationHeading);
    card.appendChild(conditionPara);
    card.appendChild(tempPara);
    card.appendChild(humidityPara);
    card.appendChild(toggleBtn);

    container.appendChild(card);
}