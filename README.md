#Sequence Web app generator

[Yeoman](https://github.com/yeoman/generator) generator that scaffolds out a React front-end web app using [gulp](http://gulpjs.com/).

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

The generated project structure can be viewed in `generator-sequence-webapp/generators/app/templates`.