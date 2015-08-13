# Repo ◉ Explorer

This app allows you to browse organization's Github projects and view the latest commits. The application consists of a client side app written in Angular 1.x and a server side companion written in Node. It can easily be run via Docker or on Heroku.

Demo: _link to app running in Heroku_

## Installation

There are a couple of easy ways to run the application: locally via Docker or hosted remotely on Heroku.

### Via Docker

#### Requirements 

* Docker 1.8

#### Installation steps

1. Pull the project from Docker Hub and run it

`$ docker run minustime/repoexplorer`

2. Navigate to 

`<vm host ip>:8000`

### Via Heroku

#### Requirements 

* A free Heroku account

#### Installation steps

1. _insert heroku deploy button here_

## Development setup

### Requirements

* Node 0.10.x
* npm 1.4.x

### Installation steps

1. Get the code

`$ git clone git@github.com:minustime/repoexplorer.git`
`$ cd repoexplorer/client`

2. Install build tools

`$ npm install -g gulp`

3. Install libraries required by application

`$ npm install`
`$ bower install`

4. Build application

`$ gulp build`