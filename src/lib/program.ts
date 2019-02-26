import ts from 'typescript';


// Classes
export class File {
  private sourceFile: ts.SourceFile | undefined;

  constructor(public readonly fileName: string, public readonly content: string) {
  }

  public getSourceFile(languageVersion: ts.ScriptTarget): ts.SourceFile {
    if (!this.sourceFile || (this.sourceFile.languageVersion !== languageVersion)) {
      this.sourceFile = ts.createSourceFile(this.fileName, this.content, languageVersion, true);
    }

    return this.sourceFile;
  }
}

// Functions
export const createProgram = (files: File[], compilerOptions: ts.CompilerOptions = {}): ts.Program => {
  const compilerHost = ts.createCompilerHost(compilerOptions);

  compilerHost.getSourceFile = (fileName, languageVersion) => {
    const file = files.find(f => f.fileName === fileName);
    return file && file.getSourceFile(languageVersion);
  };

  return ts.createProgram(files.map(f => f.fileName), compilerOptions, compilerHost);
};
