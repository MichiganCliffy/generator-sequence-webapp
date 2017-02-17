#Sequence Web app generator

[Yeoman](https://github.com/yeoman/generator) generator that creates a React app using [gulp](http://gulpjs.com/) from scratch.

##Setup
Install Yeoman:

```
npm install -g yo
```

Clone the repo and install dependencies. To make the generator available to Yeoman, run `npm link` to create a symlink from this repo to `node_modules/generator-sequence-webapp` making it globally available:

```
git clone git@github.com:SequenceLLC/generator-sequence-webapp.git
cd generator-sequence-webapp
npm install && npm link
```

##Usage
Run the generator with `yo` to create a React app (this will create the project directory):

```
yo sequence-webapp [<app-name>]
```

If you want to check out the project structure before generating one, you can view the project template in `generator-sequence-webapp/generators/app/templates`.

To run the app:

```
cd <app-name>
npm install
gulp
```

##Features
ES6<br/>
Live reload
