import chalk from 'chalk';
import 'source-map-support/register';
import ts from 'typescript';
import {createProgram, File} from './program';
import {Visitor, Visitor2} from './visitors';


// Run
_main();

// Helpers
function _main(): void {
  const compilerOptions: ts.CompilerOptions = {types: []};
  const files: File[] = [
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
  ];

  const program = createProgram(files, compilerOptions);
  const visitor = new Visitor2(program);

  processProgram(program, visitor);
}

function processProgram(program: ts.Program, visitor: Visitor): void {
  console.log(chalk.yellow(`--== Start ==--`));

  program.getSourceFiles().forEach(sf => {
    console.log(chalk.cyan(`## Processing '${sf.fileName}'...`));
    visitor.visit(sf);
  });

  console.log(chalk.yellow(`--==  End  ==--`));
}
