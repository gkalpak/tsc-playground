import chalk from 'chalk';
import ts from 'typescript';
import {Visitor} from './visitor';


export class Visitor1 extends Visitor {
  public visit(node: ts.Node, level: number = 0): void {
    this.visitOne(node, level);
    node.forEachChild(child => this.visit(child, level + 1));
  }

  protected printNode(node: ts.Node, level: number, noColor = false): string {
    const rawKind = ts.SyntaxKind[node.kind];
    const rawText = node.getText().replace(/\s+/g, ' ').trim();

    const indentation = '  '.repeat(level);
    const kind = noColor ? rawKind : chalk.magenta(rawKind);
    const text = noColor ? rawText : chalk.gray(rawText);

    return `${indentation}${kind}: ${text}`;
  }

  protected visitOne(node: ts.Node, level: number): void {
    console.log(this.printNode(node, level));
  }
}
