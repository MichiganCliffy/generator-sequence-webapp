'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;

module.exports = class extends Generator {
  constructor(args, opts) {
    super (args, opts);

    this.log(chalk.bold.green('   ____                                        '));
    this.log(chalk.bold.green('  / ___|  ___  __ _ _   _  ___ _ __   ___ ___  '));
    this.log(chalk.bold.green('  \\___ \\ / _ \\/ _\' | | | |/ _ \\ \'_ \\ / __/ _ \\ '));
    this.log(chalk.bold.green('   ___) |  __/ (_| | |_| |  __/ | | | (_|  __/ '));
    this.log(chalk.bold.green('  |____/ \\___|\\__, |\\__,_|\\___|_| |_|\\___\\___| '));
    this.log(chalk.bold.green('                 |_|                           '));

    this.option('babel');
    this.argument('appname', { type: String, required: false});
  }

  initializing() {
    if (this.options.appname) {
      this.log(chalk.green('generating') + ' ' + this.options.appname);
    }
  }

  prompting() {
    return this.prompt(this._getPrompts()).then((answers) => {
      if (answers.AppName) {
        this.options.appname = answers.AppName;
      }
      this.options.install = answers.ShouldInstall;
    });
  }
  _getPrompts() {
    var namePrompt = {
      type: 'input',
      name: 'AppName',
      message: 'App name: ',
      default: 'sample-app'
    };
    var installPrompt = {
      type: 'confirm',
      name: 'ShouldInstall',
      message: 'Run npm install after setup?',
      default: true
    };
    var prompts = [];
    if (!this.options.appname) {
      prompts.push(namePrompt);
    }
    prompts.push(installPrompt);

    return prompts;
  }

  configuring() {
    this.config.save();
  }

  default() {}

  writing() {
    mkdirp(this.destinationPath(this.options.appname));
    this.destinationRoot(this.destinationPath(this.options.appname));
    this._writeTemplates();
    this._writeDir();
  }
  _writeTemplates() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { appname: this.options.appname }
    );
    // select package.json based on project type
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { appname: this.options.appname }
    );
    this.fs.copyTpl(
      this.templatePath('src/html/index.html'),
      this.destinationPath('src/html/index.html'),
      { appname: this.options.appname }
    );
  }
  _writeDir() {
    this.log(chalk.green('create') + ' dirs');
    // recursively copy project structure
    var opts = { 'clobber': false };
    ncp(this.templatePath(), this.destinationPath(), opts, () => {});
  }

  // install dependencies based on project type
  install() {
    if (this.options.install) {
      this.installDependencies({npm: true, bower: false, yarn: false});
    }
  }

  end() {
    var cmd;
    if (this.options.install) {
      cmd = 'cd ' + this.options.appname + ' && gulp';
    } else {
      cmd = 'cd ' + this.options.appname + ' && npm install && gulp';
    }
    this.log(
      chalk.yellow(this.options.appname) + ' is ' + chalk.green('ready')
      + '. Run ' + chalk.yellow(cmd) + ' to get started.'
    );
  }
};
