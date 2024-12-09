# Project created with create react app using CRACO

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and using CRACO configuration file [CRACO](https://github.com/dilanx/craco)

## Dockefile

A dockerfile is provided to run the application with the following build arguments:

- REACT_APP_BASE_URL: Url of the API provided by the project [backend](https://github.com/onetree-com/india-policy-insights-backend) 
- ARG REACT_APP_WEBSITE_URL: Url where the tool will be hosted
- ARG REACT_APP_WEBSITE_HOME_URL: Url of the project home
- ARG REACT_APP_MAP_SOURCE_URL: Url of the maps tile server

The default values are set to work with the [docker compose file provided](https://github.com/onetree-com/india-policy-insights-backend/blob/main/src/docker-compose.yml)

