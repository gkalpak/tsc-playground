import ts from 'typescript';
import {Visitor1} from './visitor-1';


interface IConditional {
  index: number;
  condition: ts.BinaryExpression | null,
  functionCall: ts.CallExpression;
}

export class Visitor4 extends Visitor1 {
  protected getFunctionCall(node: ts.Expression): ts.CallExpression {
    if (ts.isParenthesizedExpression(node)) {
      return this.getFunctionCall(node.expression);
    }

    if (ts.isBinaryExpression(node) &&
        [ts.SyntaxKind.CommaToken, ts.SyntaxKind.EqualsToken].includes(node.operatorToken.kind)) {
      return this.getFunctionCall(node.right);
    }

    if (!ts.isCallExpression(node)) {
      throw new Error('Unsupported format.');
    }

    return node;
  }

  protected printConditionals(conditionals: IConditional[]): void {
    console.log(`  Found ${conditionals.length} conditionals:`);

    for (const cond of conditionals) {
      console.log(
          `    index:        ${cond.index}\n` +
          `    condition:    ${cond.condition?.getText()}\n` +
          `    fanctionCall: ${cond.functionCall.getText()}\n` +
          '    ---');
    }
  }

  protected processConditional(node: ts.ConditionalExpression): IConditional[] {
    const conditionals: IConditional[] = [];
    let current: ts.Expression = node;

    while (ts.isConditionalExpression(current)) {
      if (!ts.isBinaryExpression(current.condition)) {
        throw new Error('Unsupported format.');
      }

      conditionals.push({
        index: conditionals.length,
        condition: current.condition,
        functionCall: this.getFunctionCall(current.whenTrue),
      });

      current = current.whenFalse;
    }

    conditionals.push({
      index: conditionals.length,
      condition: null,
      functionCall: this.getFunctionCall(current),
    });

    return conditionals;
  }

  protected processIf(node: ts.IfStatement): IConditional[] {
    const conditionals: IConditional[] = [];
    let current: ts.Statement | undefined = node;

    while (current && ts.isIfStatement(current)) {
      if (!ts.isBinaryExpression(current.expression) ||
          !ts.isExpressionStatement(current.thenStatement)) {
        throw new Error('Unsupported format.');
      }

      conditionals.push({
        index: conditionals.length,
        condition: current.expression,
        functionCall: this.getFunctionCall(current.thenStatement.expression),
      });

      current = current.elseStatement;
    }

    if (current) {
      if (!ts.isExpressionStatement(current)) {
        throw new Error('Unsupported format.');
      }

      conditionals.push({
        index: conditionals.length,
        condition: null,
        functionCall: this.getFunctionCall(current.expression),
      });
    }

    return conditionals;
  }

  protected visitOne(node: ts.Node, _level: number): void {
    if (!ts.isFunctionExpression(node) || (node.body.statements.length !== 1)) {
      return;
    }

    const stmt = node.body.statements[0];

    if (ts.isExpressionStatement(stmt) && ts.isConditionalExpression(stmt.expression)) {
      const conditionals = this.processConditional(stmt.expression);
      this.printConditionals(conditionals);
      return;
    }

    if (ts.isIfStatement(stmt)) {
      const conditionals = this.processIf(stmt);
      this.printConditionals(conditionals);
      return;
    }
  }
}
