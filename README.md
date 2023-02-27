# Get Started

## Technical test instruction

https://github.com/InnovOrder/software-technical-tests/tree/master/crud-nestjs

## Installation

```bash
git clone https://github.com/JuLblc/api-crud-nestJS.git
cd your-path/api-crud-nestJS
$ npm install
```

## Configuration .env

See below an exemple of the .env file

```bash
PORT=3000
MONGODB_URI=mongodb+srv://innovorder:innovorder@cluster0.vup2r.mongodb.net/api-crud-nest-js
SESSION_SECRET=your-session-secret
```

## Running the app locally

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the Docker containers

```bash
cd your-path/api-crud-nestJS
```

```bash
docker-compose up dev
```

or

```bash
docker-compose up prod
```

# Routes

Home: GET - http://localhost:3000/ </br>

To register a new user: POST - http://localhost:3000/users </br>
Please provide as JSON

```bash
{
    "email":"jdoe@email.com",
    "password":"YourPassword1"
}
```

To log in: POST - http://localhost:3000/auth/sessions </br>
Please provide as JSON

```bash
{
    "email":"jdoe@email.com",
    "password":"YourPassword1"
}
```

Once logged id, to get product detail from API OpenFoodFact: GET - http://localhost:3000/737628064502 </br>

To update user: PUT - http://localhost:3000/users </br>
Please provide as JSON the field(s) you would like to update

```bash
{
    "email":"update@email.com",
    "password":"NewPass1"
}
```

# Tests

## Unit tests

```bash
$ npm run test
```

## e2e

```bash
$ npm run test:e2e
```
