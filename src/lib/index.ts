import chalk from 'chalk';
import 'source-map-support/register';
import ts from 'typescript';
import {createProgram, File} from './program';
import {IVisitor, IVisitorCtor, Visitor2, Visitor3, Visitor4} from './visitors';


// Run
_main();

// Helpers
function _main(): void {
  // tslint:disable-next-line: variable-name
  const VisitorCtor: IVisitorCtor = Visitor4;

  const compilerOptions: ts.CompilerOptions = {types: []};
  const files: File[] =
    (VisitorCtor === Visitor2) ?
      [
        new File('test.ts', `
          var Foo = (function () {
            function Foo() {
              this.bar = 'bar';
            }
            Foo.staticBar = function () {};
            Foo.prototype.getBar = function getBar() {
              return this.bar;
            };
            return Foo;
          }());
        `),
      ] :
    (VisitorCtor === Visitor3) ?
      [
        new File('test.ts', `
          declare const exports: any;

          exports.foo = class Foo {};
          exports['bar'] = class Bar {};
        `),
      ] :
    (VisitorCtor === Visitor4) ?
      [
        new File('test-1.ts', `
          (function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ?
              // CommonJS2 factory call.
              factory(exports, require('foo'), require('bar')) :
            typeof define === 'function' && define.amd ?
              // AMD factory call.
              define(['exports', 'foo', 'bar'], factory) :
              // Global factory call.
              (factory((global['my-lib'] = {}), global.foo, global.bar));
          }(this, (function (exports, foo, bar) {
            // ...
          }));
        `),
        new File('test-2.ts', `
          (function (root, factory) {
            if (typeof exports === 'object' && typeof module === 'object')
              // CommonJS2 factory call.
              module.exports = factory(require('foo'), require('bar'));
            else if (typeof define === 'function' && define.amd)
              // AMD factory call.
              define(['foo', 'bar'], factory);
            else if (typeof exports === 'object')
              // CommonJS factory call.
              exports['my-lib'] = factory(require('foo'), require('bar'));
            else
              // Global factory call.
              root['my-lib'] = factory(root['foo'], root['bar']);
          })(global, function (foo, bar) {
            // ...
        `),
      ] :
      [];

  const program = createProgram(files, compilerOptions);
  const visitor = new VisitorCtor(program);

  processProgram(program, visitor);
}

function processProgram(program: ts.Program, visitor: IVisitor): void {
  console.log(chalk.yellow(`--== Start ==--`));

  program.getSourceFiles().forEach(sf => {
    console.log(chalk.cyan(`## Processing '${sf.fileName}'...`));
    visitor.visit(sf);
  });

  console.log(chalk.yellow(`--==  End  ==--`));
}
