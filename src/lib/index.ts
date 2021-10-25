import chalk from 'chalk';
import 'source-map-support/register';
import ts from 'typescript';
import {createProgram, File} from './program';
import {Visitor, Visitor3} from './visitors';


// Run
_main();

// Helpers
function _main(): void {
  const compilerOptions: ts.CompilerOptions = {types: []};
  const files: File[] = [
    new File('test.ts', `
      declare const exports: any;

      exports.foo = class Foo {};
      exports['bar'] = class Bar {};
    `),
  ];

  const program = createProgram(files, compilerOptions);
  const visitor = new Visitor3(program);

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
