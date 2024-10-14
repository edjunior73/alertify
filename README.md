# Alertify

## Requirements

- NodeJS (>=18.18)
- Docker

## Installation

```bash
# Install dependencies
$ yarn
# Setup docker
$ yarn init:dev
```

## Running the app

```bash
# development
$ yarn dev
```

## Swagger docs

http://localhost:4000/docs

## Logs

Logs will appear in the console during the application execution, allowing you to monitor activity and debug issues.

## Apm

APM
To access the APM, run the following command:

```bash
# development
$ yarn dev:docker:up
```

Then, open your browser and go to http://localhost:5601. You should find the APM under the corresponding tab.

## Test

```bash
$ yarn test
```
