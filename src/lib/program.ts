import ts from 'typescript';


// Classes
export class File {
  private sourceFile: ts.SourceFile | undefined;

  constructor(public readonly fileName: string, public readonly content: string) {
  }

  public getSourceFile(opts: ts.CreateSourceFileOptions): ts.SourceFile {
    if (!this.sourceFile || (this.sourceFile.languageVersion !== opts.languageVersion)) {
      this.sourceFile = ts.createSourceFile(this.fileName, this.content, opts, true);
    }

    return this.sourceFile;
  }
}

// Functions
export const createProgram = (files: File[], compilerOptions: ts.CompilerOptions = {}): ts.Program => {
  const compilerHost = ts.createCompilerHost(compilerOptions);

  compilerHost.getSourceFile = (fileName, languageVersionOrOptions) => {
    const file = files.find(f => f.fileName === fileName);
    const opts = (typeof languageVersionOrOptions === 'object') ?
      languageVersionOrOptions :
      {languageVersion: languageVersionOrOptions};

    return file && file.getSourceFile(opts);
  };

  return ts.createProgram(files.map(f => f.fileName), compilerOptions, compilerHost);
};
