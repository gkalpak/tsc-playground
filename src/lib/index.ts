import chalk from 'chalk';
import ts from 'typescript';


// Run
_main(process.argv.slice(2));

// Helpers
function _main(args: string[]): void {
  console.log(chalk.green('Hello, world!'));
  console.log(chalk.dim(`(args: [${args.join(' ')}] | ts: ${typeof ts})`));
}
