import ts from 'typescript';


export abstract class Visitor {
  protected readonly checker = this.program.getTypeChecker();

  constructor(protected readonly program: ts.Program) {
  }

  public abstract visit(node: ts.Node, level?: number): void;
}
