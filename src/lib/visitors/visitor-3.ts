import chalk from 'chalk';
import ts from 'typescript';
import {Visitor1} from './visitor-1';


export class Visitor3 extends Visitor1 {
  protected visitOne(node: ts.Node, level: number): void {
    super.visitOne(node, level);

    if (ts.isPropertyAccessExpression(node)) {
      console.log(chalk.blue(`${'  '.repeat(level)}(Property access.)`));
      console.log('Symbol:', this.checker.getSymbolAtLocation(node.name));
    } else if (ts.isElementAccessExpression(node)) {
      console.log(chalk.blue(`${'  '.repeat(level)}(Element access.)`));
    }
  }
}
