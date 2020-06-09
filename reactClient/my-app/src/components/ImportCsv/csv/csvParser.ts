import { parse, ParseResult } from 'papaparse';

// CsvParser class using papaparse

export class CsvParser {
  private result?: ParseResult;

  parseFile(file: File, preview = 0): PromiseLike<void> {
    return new Promise((resolve, reject) => {
        parse(file, {
          header: true,
          preview: preview,
          complete: (result) => {
            this.result = result;
            resolve();
            },
          error: (err) => {
            reject(err);
            }
          });
        });
  }

  preview(file: File): PromiseLike<void> {
    return this.parseFile(file, 5);
  }

  getHeaders(): Array<string> {
    if (!this.result)
      return [];
    return this.result.meta.fields;
  }

  getDelimiter(): string {
    if (!this.result)
      return "";
    return this.result.meta.delimiter;
  }

  getRows(): Array<{[index: string]:string}> {
    if (this.result && this.result.data) {
      return this.result.data;
    }
    return [];
  }
}
