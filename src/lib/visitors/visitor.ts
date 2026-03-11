import ts from 'typescript';


export interface IVisitor {
  visit(node: ts.Node, level?: number): void;
}

export type IVisitorCtor = new(program: ts.Program) => IVisitor;

export abstract class Visitor implements IVisitor {
  protected readonly checker = this.program.getTypeChecker();

  constructor(protected readonly program: ts.Program) {
  }

  public abstract visit(node: ts.Node, level?: number): void;
}
