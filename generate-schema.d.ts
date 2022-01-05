declare module 'generate-schema' {
  import { JSONSchema4 } from 'json-schema';

  function json(title: string, object: any): JSONSchema4;
}
