import { createIdentity } from 'identitate';
import type { Path as PathArray, PathItem } from 'pathington';
import { parse } from 'pathington';
import type { CreateSelectorFunction, CreateSelectorOptions } from 'reselect';
import { createSelectorCreator, weakMapMemoize } from 'reselect';
import { INVALID_OBJECT_PATH_MESSAGE, INVALID_PATH_MESSAGE } from './constants.js';
import type {
  AnyFn,
  ComputeValue,
  ManualSelectInput,
  Path,
  PathObject,
  PathStructured,
  SelectStructuredInputs,
  StructuredValues,
} from './internalTypes.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Whether the path is a functon
 */
export function isManualSelector<Params extends unknown[]>(path: Path<Params>): path is ManualSelectInput<Params> {
  return typeof path === 'function';
}

/**
 * Whether the path is an object.
 */
export function isObjectPath(path: any): path is PathObject {
  return !!path && typeof path === 'object' && !Array.isArray(path);
}

export function isPathItem(path: any): path is PathItem {
  return path != null && (typeof path === 'string' || typeof path === 'number' || typeof path === 'symbol');
}

/**
 * Create the identity selector function based on the path passed. If the path item is a function then it is used directly,
 * otherwise the function is created based on its type.
 */
export function createIdentitySelector<Params extends unknown[]>(path: Path<Params>) {
  if (isManualSelector(path)) {
    return path;
  }

  if (isObjectPath(path)) {
    if (hasOwnProperty.call(path, 'path')) {
      const { argIndex = 0, path: objectPath } = path;

      const selectorIdentity = createIdentity(argIndex);
      const parsedPath: PathItem[] | null = isPathItem(objectPath)
        ? parse(objectPath)
        : Array.isArray(objectPath) && objectPath.every(isPathItem)
          ? parse(objectPath)
          : null;

      if (parsedPath != null) {
        return function (...args: any[]) {
          return getDeep(parsedPath, selectorIdentity(...args));
        };
      }
    }

    throw new ReferenceError(INVALID_OBJECT_PATH_MESSAGE);
  }

  const parsedPath = isPathItem(path)
    ? parse(path)
    : Array.isArray(path) && path.every(isPathItem)
      ? parse(path)
      : null;

  if (parsedPath != null) {
    return <State>(state: State) => getDeep(parsedPath, state);
  }

  throw new TypeError(INVALID_PATH_MESSAGE);
}

/**
 * Get the value at the deep location expected from the path. If no match is found, return `undefined`.
 */
export function getDeep<State>(path: PathArray, state: State) {
  if (state == null) {
    return;
  }

  let value: any = state;

  for (let index = 0, length = path.length; index < length; ++index) {
    const pathItem = path[index] as keyof typeof state;

    value = value[pathItem];

    if (value == null && index < length - 1) {
      return;
    }
  }

  return value;
}

/**
 * Get the creator function to use when generating the selector.
 */
export function getSelectorCreator({
  argsMemoize,
  argsMemoizeOptions,
  devModeChecks,
  memoize,
  memoizeOptions,
}: CreateSelectorOptions) {
  return createSelectorCreator({
    argsMemoize,
    argsMemoizeOptions,
    devModeChecks,
    memoize: memoize ?? weakMapMemoize,
    memoizeOptions,
  });
}

/**
 * Get a standard selector based on the paths and getComputedValue provided.
 */
export function getStandardSelector<
  const Params extends unknown[],
  const Paths extends Array<Path<Params>>,
  GetComputedValue extends ComputeValue<Params, Paths, any>,
>(paths: Paths, selectorCreator: CreateSelectorFunction, getComputedValue: GetComputedValue) {
  return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
}

/**
 * Get the structured object based on the computed selector values.
 */
export function getStructuredObject(properties: string[]): AnyFn {
  return function structuredObject(...values: any[]) {
    return properties.reduce<Record<string, any>>((structuredObject, property, index) => {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {});
  };
}

/**
 * Get an object of property => selected value pairs based on paths.
 */
export function getStructuredSelector(
  paths: PathStructured<any[]>,
  selectorCreator: CreateSelectorFunction,
  getComputedValue: AnyFn,
) {
  const selectors = Object.keys(paths).map((key) =>
    createIdentitySelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      paths[key]!,
    ),
  );

  return selectorCreator(selectors, getComputedValue);
}

/**
 * Get an object of property => selected value pairs based on paths.
 */
export function getStructuredIdentitySelector<
  const Params extends unknown[],
  const Paths extends PathStructured<Params>,
>(paths: Paths) {
  const properties = Object.keys(paths);

  return function structuredObject(...values: StructuredValues<Params, Paths>) {
    return properties.reduce<Record<string, any>>((structuredObject, property, index) => {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {}) as SelectStructuredInputs<Params, Paths>;
  };
}
