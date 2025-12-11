import { createIdentity } from 'identitate';
import type { Path as PathArray, PathItem } from 'pathington';
import { parse } from 'pathington';
import type { CreateSelectorOptions } from 'reselect';
import { createSelectorCreator, lruMemoize } from 'reselect';
import { INVALID_OBJECT_PATH_MESSAGE, INVALID_PATH_MESSAGE } from './constants.js';
import type { AnyFn, Path, PathObject } from './internalTypes.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * is the path a functions
 */
export function isFunctionPath<Params extends unknown[]>(path: Path<Params>): path is AnyFn {
  return typeof path === 'function';
}

/**
 * is the path an object
 */
export function isObjectPath(path: any): path is PathObject {
  return !!path && typeof path === 'object' && !Array.isArray(path);
}

export function isPathItem(path: any): path is PathItem {
  return path != null && (typeof path === 'string' || typeof path === 'number' || typeof path === 'symbol');
}

/**
 * based on the path passed, create the identity function for it or return the function itself
 */
export function createIdentitySelector<Params extends unknown[]>(path: Path<Params>) {
  if (isFunctionPath(path)) {
    return path;
  }

  if (isObjectPath(path)) {
    if (hasOwnProperty.call(path, 'path') && hasOwnProperty.call(path, 'argIndex')) {
      const { argIndex, path: objectPath } = path;

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

function getDeep<State>(path: PathArray, state: State) {
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
 * get the creator function to use when generating the selector
 */
export function getSelectorCreator({
  argsMemoize,
  argsMemoizeOptions,
  memoize,
  memoizeOptions,
}: CreateSelectorOptions): AnyFn {
  return createSelectorCreator({
    argsMemoize,
    argsMemoizeOptions,
    memoize: memoize ?? lruMemoize,
    memoizeOptions,
  });
}

/**
 * get a standard selector based on the paths and getComputedValue provided
 */
export function getStandardSelector<Paths extends Array<Path<any[]>>>(
  paths: Paths,
  selectorCreator: AnyFn,
  getComputedValue: AnyFn,
): AnyFn {
  return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
}

/**
 * get the structured object based on the computed selector values
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
 * get an object of property => selected value pairs bsaed on paths
 */
export function getStructuredSelector(paths: Record<string, any>, selectorCreator: AnyFn): AnyFn {
  const destinationKeys = Object.keys(paths);
  const selectors = destinationKeys.map((key) => createIdentitySelector(paths[key]));

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
}
