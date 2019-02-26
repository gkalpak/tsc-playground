import ts from 'typescript';
import {Visitor1} from './visitor-1';


export class Visitor2 extends Visitor1 {
  protected getIifeBody(node: ts.VariableDeclaration): ts.Block | undefined {
    const call = node.initializer;
    const fnExpression = call &&
      ts.isParenthesizedExpression(call) &&
      ts.isCallExpression(call.expression) &&
      call.expression.expression;

    return (fnExpression && ts.isFunctionExpression(fnExpression)) ? fnExpression.body : undefined;
  }

  protected visitOne(node: ts.Node, level: number): void {
    if (!ts.isVariableDeclaration(node)) return;

    const iifeBody = this.getIifeBody(node);
    if (!iifeBody) return;

    const functionDeclaration = iifeBody.statements.find(ts.isFunctionDeclaration);
    const returnStatement = iifeBody.statements.find(ts.isReturnStatement);
    if (!functionDeclaration || !returnStatement) return;

    const functionIdentifier = functionDeclaration.name && ts.isIdentifier(functionDeclaration.name) &&
      functionDeclaration.name;
    const returnIdentifier = returnStatement.expression && ts.isIdentifier(returnStatement.expression) &&
      returnStatement.expression;
    if (!functionIdentifier || !returnIdentifier) return;

    const functionSymbol = this.checker.getSymbolAtLocation(functionIdentifier);
    const returnSymbol = this.checker.getSymbolAtLocation(returnIdentifier);
    if (!functionSymbol || (functionSymbol !== returnSymbol)) return;

    if (returnSymbol.valueDeclaration !== functionDeclaration) return;

    super.visitOne(functionDeclaration, level);
  }
}
