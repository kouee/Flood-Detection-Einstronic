// Google Sheets API details
const SHEET_ID = '1Bn88LtJoxqHYvokRoldJ54N-9wFhz2lRuDUAALSmot4';
const API_KEY = 'AIzaSyAQwSlxWgIRV87jDZbRHqk1Ex9T3mPkGLo';
const range = 'EinstronicWaterLevel!A:B'; // Adjust range if necessary

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

// Fetch and display water level data
async function fetchWaterLevel() {
    try {
        const response = await fetch(url); // Fetch data from Google Sheets API
        const data = await response.json();
        const rows = data.values;

        // Get the latest water level data (assuming the last row is the most recent)
        const latestData = rows[rows.length - 1];
        const waterLevel = latestData[1].toLowerCase().trim(); // Water level is in column B
        const updatedTime = latestData[0]; // Time is in column A

        const waterLevelElement = document.getElementById('water-level-circle');
        const waterLevelText = document.getElementById('water-level-text');
        const updatedTimeElement = document.getElementById('updated-time');

        updatedTimeElement.textContent = updatedTime;

        // Remove existing classes before applying new ones
        waterLevelElement.classList.remove('low-circle', 'mid-circle', 'high-circle');

        // Update water level display and class based on the level
        if (waterLevel === 'low') {
            waterLevelElement.textContent = 'Low';
            waterLevelElement.classList.add('low-circle');
            waterLevelText.textContent = 'Water Puddle Level';
        } else if (waterLevel === 'mid') {
            waterLevelElement.textContent = 'Mid';
            waterLevelElement.classList.add('mid-circle');
            waterLevelText.textContent = 'Moderate Flood';
        } else if (waterLevel.includes('warning')) { // For "Warning! High"
            waterLevelElement.textContent = 'High';
            waterLevelElement.classList.add('high-circle');
            waterLevelText.textContent = 'Warning! High Flood area';
        }

        // Update the map popup content with water level data
        if (marker) {
            marker.bindPopup(`
                <div>
                    <h3>Donggongon</h3>
                    <p><strong>Water Level:</strong> ${waterLevel.charAt(0).toUpperCase() + waterLevel.slice(1)}</p>
                    <p><strong>Last Updated:</strong> ${updatedTime}</p>
                </div>
            `);
        }

    } catch (error) {
        console.error('Error fetching water level data:', error);
    }
}

// Fetch water level data every 5 seconds
setInterval(fetchWaterLevel, 10000);

// Fetch the initial data when the page loads
fetchWaterLevel();

// Initialize Leaflet map
const map = L.map('map').setView([5.909649, 116.101370], 18); // Coordinates for your location

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker at the specified location
const marker = L.marker([5.909649, 116.101370]).addTo(map);

// Add popup to the marker, it will be updated later
marker.bindPopup('Loading water level data...');

// Update the popup content with water level data on click
marker.on('click', () => {
    fetchWaterLevel(); // Fetch latest water level when the marker is clicked
});
