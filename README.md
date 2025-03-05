# IrvineHack2025 - ValueGue$$r

## What it is:
This was our submission to IrvineHacks 2025! Inspired by Geoguesser we created a game to test people's knowledge on Assessed Property value in the Orange County (California) area. It is a webapp game that has a Vite frontend, pulling data from a local server that is ran separately.

## Tools:
We built this webapp project using React.js and Vite for the front-end while using FastAPI and MongoDB for the backend. Our database was deployed on a MongoDB atlas cluster. Additionally, for the map we used Mapbox, a 3d map tool that allows us to implement many different maps including a satellite view map within our web application.

## Building and Running:
We have separated our Backend and Frontend into 2 folders:
`FastAPIPython` and `vite-project`

There is a .env file that is required for both the frontend and backend to hold API keys. These are not shared for security reasons.

### Backend
To run our backend navigate to the `FastAPIPython` directory and first install requirements:
`pip install “fastapi[standard]”` and
`pip install motor`

Then run:
`uvicorn main:app  --reload --host localhost --port 8000`

.env requires an Altas URI and Database name

### Frontend
To run our frontend first run an `npm install`

Then run:
`npm run dev`

.env requires the API key for Mapbox

**Check out more on our [Devpost!](https://devpost.com/software/valueguessr)**
