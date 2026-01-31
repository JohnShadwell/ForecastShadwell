# Weather/Forecast App

## Running the Application

You can run this app instantly using **Expo Snack**—no local setup required:

1. Open this link in your browser: [Expo Snack Link](https://snack.expo.dev/@johnshadwell/forecastshadwell)  
2. Download the **Expo Go** app on your phone (iOS or Android).  
3. Scan the QR code on the Snack page or click "Open in Expo Go".  
4. The app will run directly on your device.

> **Alternative:** You can run the project locally by cloning the repository, installing dependencies, and starting the Expo development server, but this is **not recommended** as I have personally encountered issues with environment or dependency mismatches.

---

## Overview

This Weather/Forecast App allows users to view current and upcoming weather conditions for a specified location. Users can input latitude and longitude to fetch real-time weather data, including temperature, wind speed, and weather conditions, as well as forecast icons for the next few days.

---

## Features

- Enter custom latitude and longitude to get weather for any location  
- Displays current temperature, wind speed, and weather conditions  
- Shows weather icons for current conditions and the next 4 forecasted periods  
- Simple, clean interface for easy reading of weather data  

---

## Technology Stack

- **Framework:** React Native  
- **Platform:** Expo  
- **Languages:** JavaScript  
- **Libraries / Dependencies:**  
  - `react-native-responsive-fontsize` for adaptive text sizes  
  - Built-in `fetch` API to call **OpenWeatherMap** API for weather data  

---

## Implementation Details

- Uses React Native state (`useState`) to store latitude, longitude, and weather data.  
- Fetches weather data from the **OpenWeatherMap API** using the 5-day forecast endpoint.  
- Current conditions and icons are extracted from the API response and displayed in the UI.  
- Calculates future dates dynamically to display the forecast for the next 4 periods.  
- Layout divided into three main sections: Location input, Current Conditions, and Future Forecast.  
- Responsive UI using `react-native-responsive-fontsize` and flex layout for readability on different screen sizes.

---

## Learning Outcomes

- Learned to integrate an external API (OpenWeatherMap) with React Native  
- Gained experience managing multiple states for dynamic UI updates  
- Developed skills in handling user input and validating latitude/longitude  
- Practiced laying out multiple sections of information using React Native styling  

---

## Future Improvements

- Add automatic geolocation to detect the user’s location without manual input  
- Include more detailed forecast data, such as humidity, UV index, and precipitation  
- Implement caching to reduce API calls and improve performance  
- Add a visually appealing theme or background changes based on weather  
- Enable switching between metric and imperial units  

---

## Portfolio Context

This project showcases my ability to build data-driven mobile applications using React Native and Expo. It highlights skills in integrating APIs, managing complex state, and presenting dynamic information in a user-friendly way, making it a strong addition to a portfolio of mobile projects.
