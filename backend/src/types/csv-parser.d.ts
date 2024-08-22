declare module 'csv-parser' {
    import { Readable } from 'stream';
  
    interface CsvParserOptions {
      // Define any options you need here
    }
  
    function csvParser(options?: CsvParserOptions): Readable;
  
    export = csvParser;
  }
  