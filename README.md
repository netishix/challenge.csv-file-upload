# Coding Exercise - CSV file upload

This repository holds a server written with ```NodeJS```, ```Typescript``` and ```Express```. The server holds a simple API with a single endpoint that allows uploading CSV files with data about vehicles.
The CSV file is uploaded and streamed to the disk for efficiency reasons. Once uploaded, the CSV is parsed according to a specific template defined by a provider, and saved to MongoDB.

## Installation

1. Install dependencies with npm. ```npm install```
2. Configure the following environment variables
 ```
    DEBUG=info,error,test - Available debug scopes used by the debug library to output useful information.
    DATABASE_URI={DATABASE_URI} - MongoDB uri to connect to the database.
    PORT={API_PORT} - Port to host the API. If no host is provided, a default port will be used.
```  
3. Start the server by running ```npm start```

## API Endpoints

The server contains the following endpoints:
* ```GET /``` - Index of the API
* ```POST /vehicles/parse-csv``` - The endpoint in charge of parsing the CSV file.

## External dependencies

The following dependencies were used to build the project:

```Express```: Used to build the API.

```Typescript```: Used to add typing support to javascript.

```Mongoose```: Used to build the data-model to persist data to MongoDB.

```Multer```: Used to handle file uploads by using content-type multipart/form-data.

```MongoDB Memory Server```: Used to mock the MongoDB server by using an on-memory approach for testing purposes.

```Debug```: Used to log useful data for debugging purposes. Check the "Installation" section to see what scopes are available for debugging.

## Data Model

The data model is composed of three core models:

```Provider```: Represents a User that loads the CSV file.

```Template```: Represents the template that is defined by a provider to load custom CSV file, that may or may not contain the required columns defined in the ```Vehicle``` model.

```Vehicle```: Represents a vehicle, or in other words, a row from the vehicles CSV file.

## Linting

Linting for this project is provided by [ESLint](https://www.npmjs.com/package/eslint/) and [ESLint Typescript parser](https://www.npmjs.com/package/@typescript-eslint/parser). To lint the project run ```npm run lint```

## Versioning

This repository is versioned using [SemVer (Semantic Versioning)](https://semver.org/) and commits are formatted by using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Testing

Tests are written with ```Jest``` and ```Supertest```. The API was tested by writing automated integration tests.

To run all the available tests run ```npm run test```

## Author

Nahuel Vazquez [(@netishix)](https://www.github.com/netishix)
