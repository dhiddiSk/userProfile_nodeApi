# About

This is an API project which facilitates users to Register, Login, update user login password and retrieve user profile data.

## Tech stack includes:

1. NodeJS
2. ExpressJS
3. MongoDB
4. Libraries("bcrypt", "body-parser", "nodemon", "express", "jsonwebtoken", "mongoose", "passport", "passport-jwt", "express-validator")

## Endpoints:

1. Deafult route(type: Get): @route /
2. User registration(name*, email*, password*, userName*): @route(type: Post) /api/auth/register
3. User login(email*, password*): @route(type: Post) /api/auth/login
4. User profile(jwt token): @route(type: Get) /api/auth/profile
5. User update password(email*, oldPassword*, password\*, jwt token): @route(type: Post) /api/auth/update

## Setup the project:

1. Clone the project to your local machine.
2. Install the required dependencies using `npm` package manager.
3. Replace the `mongoURL` in contants.js file with your own mongoDB url.
4. Launch the api from the root of the project folder using command `npm run dev`.
5. Then make the calls to the api using postman tool.

## note: 
This project is only for learning purpose.
