export const INVALID_ARRAY_PATHS_MESSAGE =
  'You have not provided any values for paths, so no values can be retrieved from state.';

export const INVALID_PATHS_MESSAGE = [
  'First parameter passed must be either an array or a plain object.',
  'If you are creating a standard selector, pass an array of either',
  'properties on the state to retrieve, or custom selector functions.',
  'If creating a structured selector, pass a plain object with source',
  'and destination properties, where source is an array of properties',
  'or custom selector functions, and destination is an array of property',
  'names to assign the values from source to.',
].join(' ');

export const INVALID_OBJECT_PATH_MESSAGE = `
When providing an object path, you must provide the following properties:
  * path: the path to retrieve, e.g. "foo.bar"
  * argIndx: the index of the argument to retrieve the path from
`.trim();

export const INVALID_PATH_MESSAGE = `
Path provided is of invalid type. It can be any one of the following values:
  * Dot-bracket notation, e.g. "foo.bar" or "bar[0].baz"
  * Number index, e.g. 0
  * Object {path, argIndex}, e.g. {path: "foo.bar", argIndex: 1}
  * Selector function
`.trim();
