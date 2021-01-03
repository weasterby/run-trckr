# Run TRCKR
Run TRCKR is a web app that can be used by clubs on [Strava](https://www.strava.com/) to create custom challenges for their members to compete in against each other.
Check it out [here](https://www.runtrckr.app).

## Overview
To get started, users log in using Strava. If it is their first time logging in, they will be prompted to give Run TRCKR permission to view their runs.
![Login page](https://i.postimg.cc/bJrJcrwR/Login.png)

Once the user has logged in, they can see a list of current public contests that they can join. Some contests may require that the user be a member
of the club hosting the challenge on Strava.
![Contests page](https://i.postimg.cc/SQz9J1mf/Contests.png)
![Join modal](https://i.postimg.cc/jj5wKZ8N/Join-Screen.png)

After the user has joined a contests, the can see a leaderboard to see how they are doing in the contest, view all the activities that have been submitted 
for that contest, and see all the avaliable challenges they can completed to earn points. They can also easily switch between contests using the dropdown at
the top.
![Leaderboard page](https://i.postimg.cc/nLCzNMzG/Leaderboard.png)

## About
Run TRCKR is build entirely in JavaScript, using [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) for the backend, and 
[React](https://reactjs.org/) for the frontend. It also uses a [PostgreSQL](https://www.postgresql.org/) database to store user data. To retrive user data
from Strava, it uses the [Strava API](https://developers.strava.com/).

## Getting Started
### Prerequisites
- node v12.18.3 or later
- npm v6.14.6 or later
- postgres 12.4 or later
- Strava Account with an API Application. You can find out more about how create one [here](https://developers.strava.com/docs/getting-started/).

### Install and Building
1) Clone this repo to your machine.
2) Run `npm install` to install all dependencies.
3) Run `npm run build` to build the React frontend. **NOTE: You will have to run this command everytime you make a change to the client folder.
4) Create a new PostgreSQL database to use with Run TRCKR.
5) Execute the `backend/db/init/create_tables.sql` SQL script in your PostgreSQL DB to create the necessary tables.
6) Execute the `node_modules/connect-pg-simple/table.sql` SQL script in your PostgreSQL DB to create a sessions table.
7) Copy the `.env.example` file to `.env`. You must go through and set some your enviroment variables.

### Running
Run `npm start` and the server will start on port 5000.
