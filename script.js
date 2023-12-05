// Function to fetch data from the provided API endpoint
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to display celestial events data
async function displayCelestialEvents() {
  const apodApiKey = 'DEMO_KEY'; // Replace with your APOD API key if necessary
  const apodApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apodApiKey}`;
  const celestialEventsData = await fetchData(apodApiUrl);
  const eventsContainer = document.getElementById('celestial-events-data');

  // Displaying relevant data from the API response
   eventsContainer.innerHTML = `
    <h3>${celestialEventsData.title}</h3>
    <img src="${celestialEventsData.url}" alt="Astronomy Picture of the Day" width="500" height="500">
    <p>${celestialEventsData.explanation}</p>
  `;
}

// Function to display satellite positions data
//Proxy Server 'cors-anywhere' is being used to forward the requests, Since it is restricted please go to 'https://cors-anywhere.herokuapp.com/' and "Request temporary access to the demo server" button before Deploying the website
async function displaySatellitePositions() {
  const n2yoApiKey = 'K6D4K8-3NSVBX-9Z3ASH-5617'; // Replace with your N2YO API key
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `https://api.n2yo.com/rest/v1/satellite/above/41.702/-76.014/0/50/18/?apiKey=${n2yoApiKey}`;

  try {
    const response = await fetch(proxyUrl + apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const satellitePositionsData = await response.json();
    const positionsContainer = document.getElementById('satellite-positions-data');

    if (satellitePositionsData && satellitePositionsData.info && satellitePositionsData.info.satcount > 0) {
      // Displaying relevant data from the API response
      positionsContainer.innerHTML = `
        <p>Number of satellites: ${satellitePositionsData.info.satcount}</p>
        <p>First satellite name: ${satellitePositionsData.above[0].satname}</p>
      `;
    }
    else {
      positionsContainer.innerHTML = '<p>No satellite data available.</p>';
    }
  } 
  catch (error) {
    console.error('Error fetching satellite positions:', error);

    if (error.message.includes('429')) {
      console.log('Rate limit exceeded. Throttling requests.');
      // Introduce a delay  before making the next request
      setTimeout(() => {
        displaySatellitePositions();
      }, 1800000); //delay
    } 
    else {
      const positionsContainer = document.getElementById('satellite-positions-data');
      positionsContainer.innerHTML = '<p>Error fetching satellite positions. Please try again later.</p>';
    }
  }
}

// Function to display upcoming launches data
async function displayUpcomingLaunches() {
  const launchesContainer = document.getElementById('upcoming-launches-data');

  try {
    const upcomingLaunchesData = await fetchData('https://ll.thespacedevs.com/2.0.0/launch/upcoming/');

    if (upcomingLaunchesData && upcomingLaunchesData.results && upcomingLaunchesData.results.length > 0) {
      // Displaying relevant data from the API response
      launchesContainer.innerHTML = `
        <ul>
          ${upcomingLaunchesData.results.map(launch => `<li>${launch.name} - ${launch.window_start}</li>`).join('')}
        </ul>
      `;
    } 
    else {
      launchesContainer.innerHTML = '<p>No upcoming launches available.</p>';
    }
  } 
  catch (error) {
    console.error('Error fetching upcoming launches:', error);
    launchesContainer.innerHTML = '<p>Error fetching upcoming launches. Please try again later.</p>';
  }
}


// Call the functions to display data on page load
displayCelestialEvents();
displaySatellitePositions();
displayUpcomingLaunches();

// You can set an interval to refresh the data periodically
setInterval(() => {
  displaySatellitePositions();
   displayUpcomingLaunches();
}, 1800000); // Refresh time in ms
