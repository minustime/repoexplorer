# Repo ◉ Explorer

This sample app allows one to browse an organization's public Github projects and view their latest commits.

The application consists of a client side app written in [AngularJS 1.4.3](https://angularjs.org/), the UI look and feel is provided by
[Bootstrap](http://getbootstrap.com/css).

The markup is written in [Jade](http://jade-lang.com), which gets compiled into HTML during the build process.
[Sass](http://sass-lang.com/) is used for some minimal styling, compiled into CSS during the build process.

[Bower](http://bower.io) is used to manage the app dependencies and [Gulp](http://gulpjs.com/) is used to compile the
markup, CSS and concatenate the JavaScript files.

Demo: [http://repoexplorer.staging.bz](http://repoexplorer.staging.bz)


## Usage

**To search for an organization and view their public repos**

1. Navigate to [http://repoexplorer.staging.bz](http://repoexplorer.staging.bz)
2. Enter the name of a Github organization
3. Click the "Explore!" button

By default the app will display projects sorted by "Stargazers" in descending order.
Projects can be sorted by "Name", "Language", "Stargazers" or "Forks".
Click on the headings to sort by either one of those parameters

To view the latest commits, click on any of the projects in the organization's repos page.
Commits are shown for the project's default branch, typically `master`.

**Bypassing Github API rate limits**

Github imposes a limit of 60 requests per hour for unauthenticated requests. In order to increase that limit to 5000
calls per hour (for testing purposes), you may enter your OAuth Client ID and Client Secret by clicking on the key icon
located on the top right.

## Installation

Please follow the steps below to install the application locally.

### Requirements

* [Node.js 0.10.x](https://nodejs.org)
* [npm 1.4.x](https://www.npmjs.com)

### Installation steps

1. Get the code

    `$ git clone git@github.com:minustime/repoexplorer.git`

2. Install the build tools

    `$ npm install -g gulp`

    `$ npm install -g bower`

3. Install libraries the application depends on

    `$ cd repoexplorer/client`

    `$ npm install`

    `$ bower install`

4. Build the application

    `$ gulp build`

5. Enjoy!

    The compiled app is located in the `client/dist` folder, please run it on a web server. For example using python:

    `$ cd dist`

    `$ python -m SimpleHTTPServer`

    navigate to `http://localhost:8000`

## Testing

### Requirements

* [PhantomJS 1.9.x](http://phantomjs.org)

### Installation steps

1. Install PhantomJS globally

    `$ npm install -g phantomjs`

2. Execute the tests

    `$ npm test`
