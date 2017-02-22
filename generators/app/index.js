'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fse = require('fs-extra');

module.exports = class extends Generator {
  constructor(args, opts) {
    super (args, opts);
    this.option('babel');
    this.argument('appname', { type: String, required: false });
  }

  initializing() {
    this.log(chalk.bold.green('   ____                                        '));
    this.log(chalk.bold.green('  / ___|  ___  __ _ _   _  ___ _ __   ___ ___  '));
    this.log(chalk.bold.green('  \\___ \\ / _ \\/ _\' | | | |/ _ \\ \'_ \\ / __/ _ \\ '));
    this.log(chalk.bold.green('   ___) |  __/ (_| | |_| |  __/ | | | (_|  __/ '));
    this.log(chalk.bold.green('  |____/ \\___|\\__, |\\__,_|\\___|_| |_|\\___\\___| '));
    this.log(chalk.bold.green('                 |_|                           '));

    if (this.options.appname) {
      this.log(chalk.green('generating') + ' ' + this.options.appname);
    }
  }

  prompting() {
    return this.prompt(this._getPrompts()).then((answers) => {
      if (answers.AppName) {
        this.options.appname = answers.AppName;
      }
      this.options.repo = answers.Repository;
      this.options.install = answers.ShouldInstall;
    });
  }
  _getPrompts() {
    let namePrompt = {
      type: 'input',
      name: 'AppName',
      message: 'App name: ',
      default: 'sample-app'
    };
    let repoPrompt = {
      type: 'input',
      name: 'Repository',
      message: 'GitHub repo: ',
      default: ''
    };
    let installPrompt = {
      type: 'confirm',
      name: 'ShouldInstall',
      message: 'Run npm install after setup?',
      default: true
    };
    let prompts = [];
    if (!this.options.appname) {
      prompts.push(namePrompt);
    }
    prompts.push(repoPrompt);
    prompts.push(installPrompt);

    return prompts;
  }

  configuring() {
    this.config.save();
  }

  default() {}

  writing() {
    fse.mkdir(this.destinationPath(this.options.appname));
    this.destinationRoot(this.destinationPath(this.options.appname));
    fse.copySync(this.templatePath(), this.destinationPath());
    this._writeTemplates();
  }
  _writeTemplates() {
    fse.removeSync(this.destinationPath('README.md'));
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { appname: this.options.appname }
    );
    // select package.json based on project type
    fse.removeSync(this.destinationPath('package.json'));
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        appname: this.options.appname,
        repo: this.options.repo
      }
    );
    fse.removeSync(this.destinationPath('src/html/index.html'));
    this.fs.copyTpl(
      this.templatePath('src/html/index.html'),
      this.destinationPath('src/html/index.html'),
      { appname: this.options.appname }
    );
  }

  // install dependencies based on project type
  install() {
    if (this.options.install) {
      this.installDependencies({npm: true, bower: false, yarn: false});
    }
  }

  end() {
    let cmd;
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
