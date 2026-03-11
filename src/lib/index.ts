import chalk from 'chalk';
import 'source-map-support/register';
import ts from 'typescript';
import {createProgram, File} from './program';
import {IVisitor, IVisitorCtor, Visitor2, Visitor3} from './visitors';


// Run
_main();

// Helpers
function _main(): void {
  const VisitorCtor: IVisitorCtor = Visitor3;

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
