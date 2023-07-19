# spotify-recommendation-tool

A personal project using the Spotify REST API. Find out your top tracks, recently played, and get song recommendations.

To run this project locally:

First you need to create an app at the spotify developer dashboard (https://developer.spotify.com/dashboard).

In the app, click "settings", here you can find your client ID and client secret.

Next, make sure your redirect URIs include:
- http://localhost:3000
- http://localhost:3001


Head back to the terminal, navigate to the client folder and run:
npm i axios spotify-web-api-node 

Navigate to the server folder and run:
npm i express cors dotenv spotify-web-api-node

Add your own environment variables (client ID and client secret) to an .env file.

Navigate to the server folder and run node index.js.
In a seperate terminal, navigate to the client folder and run yarn start.