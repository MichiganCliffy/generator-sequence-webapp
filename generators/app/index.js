'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
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
    if (!this.options.appname) {
      return this.prompt([{
        type: 'input',
        name: 'AppName',
        message: 'App name: ',
        default: 'sample-app'
      }]).then((answers) => {
        this.options.appname = answers.AppName;
      });
    }
  }

  configuring() {
    this.config.save();
  }

  default() {}

  writing() {
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
    this.installDependencies({npm: true, bower: false, yarn: false});
  }

  end() {
    this.log(
      this.options.appname + ' is ' + chalk.green('ready')
      + '. Run ' + chalk.yellow('gulp') + ' to get started.'
    );
  }
};
