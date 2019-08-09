[![Build Status](https://travis-ci.org/eliezerbasubi/WayFarer.svg?branch=develop)](https://travis-ci.org/eliezerbasubi/WayFarer)
[![Coverage Status](https://coveralls.io/repos/github/eliezerbasubi/WayFarer/badge.svg?branch=develop)](https://coveralls.io/github/eliezerbasubi/WayFarer?branch=develop)
<a href="https://codeclimate.com/github/eliezerbasubi/WayFarer/maintainability"><img src="https://api.codeclimate.com/v1/badges/77c56442f39d43ec8e0b/maintainability" /></a>
# WayFarer
WayFarer is a public bus transportation service.

## Getting Started
To get this project up and running on your local machine, follow the following instructions :

## Prerequisites

Make sure you have node -v 10 and above installed on your computer, if not, follow these instructions to install node.

#### Node installation on OS X
`$ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`

#### Node installation on Linux

`sudo apt-get install python-software-properties`

`sudo add-apt-repository ppa:chris-lea/node.js`

`sudo apt-get update`

`sudo apt-get install nodejs `

#### Node installation on Windows
Donwload the installer from the [official Node.js website](https://nodejs.org/en/)

#### Clone the project from github
`$ git clone https://github.com/eliezerbasubi/WayFarer.git`

#### Install the required dependencies found in package.json
`$ npm install`

### Start the server
`$ npm start`

### Run the tests
Testing with Mocha and Get test code coverage report with nyc
`$ npm test`

Analyze code style with eslint
`$ ./node_modules/.bin/eslint server`

## Deployment

The application template is hosted on github pages
<a href="https://eliezerbasubi.github.io/WayFarer/UI/"> https://eliezerbasubi.github.io/WayFarer/UI/ </a> <br/>

The API on heroku https://wayfarer-trip-eliezerbasubi.herokuapp.com

## UI Features
1. User can sign up. [Sign Up](https://eliezerbasubi.github.io/WayFarer/UI/signup.html)
2. User can signin. [Sign In](https://eliezerbasubi.github.io/WayFarer/UI/login.html)
3. User can reset password. [Reset Password](https://eliezerbasubi.github.io/WayFarer/UI/resetpassword.html)

#### Single Page Application UI Features
4. Admin can create a trip. [Create Trip](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)
5. Admin can cancel a trip. [Cancel Trip](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html) 
6. Both Admin and Users can view all trips. [View Trips](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html) 
7. Both Admin and Users can view a specific trip. [Specific Trip](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)
8. User can book a seat on a trip. [Book a Seat](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)
9. User can delete a booking. [Delete Booking](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)
10. User view all of his bookings. [View Booking](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)
11. Admin can view all bookings. [View Bookings](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)

### Optional Features
12.Filter trips by Origin and Destination. [Filter trips](https://eliezerbasubi.github.io/WayFarer/UI/dashboard.html)

## API CRUD Endpoints (CREATE, READ, UPDATE and DELETE)

### User Endpoints => /api/v1/
| HTTP Method | Endpoint | Public Access| Action |
|-------------|----------|-------------|---------|
| POST        |auth/signup| true        |Create user account |
| POST        |auth/signin|  true       | Logs user In  |
| POST        |auth/reset/:user_id|  false    |  Update user password|

### Trip Endpoints => /api/v1/
| HTTP Method | Endpoint | Public Access| Action |
|-------------|---------|--------------|---------|
| POST        |trips      | false        |Create a trip |
| GET         |trips       |  false     | Retrieve all trips  |
| GET        |trips/:trip_id|  false|  Retrieve a specific trip|
| PATCH        |trips/:trip_id/cancel      | false        |Cancel a trip |
| GET         |trips       |  false     | Retrieve all trips  |
| GET        |trips?origin={origin}|  false|  Filter trips by origin|
| GET         |trips?destination={destination} |  false | Filter trips by destination  |
| GET        |trips/?origin={origin}&&destination={destination}| false| Retrieve a specific trip|

### Booking Endpoints => /api/v1/

| HTTP Method | Endpoint | Public Access| Action |
|------------ |----------|-------------|--------|
| POST        | bookings | false        | Create a booking |
| GET         | bookings |  false      | View all bookings |
| GET         | bookings | false      | View specific booking|
DELETE      |bookings/1|  false    |  Delete a booking |

## Technology and Tools Used
|Front-End |Back-End |
|----------|---------|
| HTML      | Nodejs/Express|
| CSS      | Mocha   |
| JS       | Travis CI|
|          | Code Climate |
|          | Pivotal Tracker |

# Author
..*Eliezer Basubi Wikulukya

# License
This project is Licensed under MIT.

# Acknowlegments
...My thanks goes to:
...my family 
...Learning Facilitor and Team Members.
