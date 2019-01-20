# selectorator CHANGELOG

## 4.0.3

- Update `unchanged` dependency for faster `get` operations cross-browser

## 4.0.2

- Improved typings (thanks to PR [#13](https://github.com/planttheidea/selectorator/pull/13) by [@Dudeonyx](https://github.com/Dudeonyx))
- Provide targeted builds for ESM / CommonJS / UMD consumption

## 4.0.1

- Fix typings

## 4.0.0

- Switch to using typescript for build
- Use `reselect` v4

## 3.3.0 / 1.4.0

- Add support for `Object` paths to allow for shorthand usage on arguments other than first (resolves [#9](https://github.com/planttheidea/selectorator/issues/9))

## 3.2.0 / 1.3.1

- Support `SameValueZero` equality for default comparator
- Support custom `isEqual` comparator (if not `deepEqual` or `isSameValueZero` default)
- Remove `kari` dependency in favor of faster and more accurate `fast-equals` and `unchanged` dependencies

## 1.3.0

- Bad publish - do not use

## 3.1.1 / 1.2.1

- Fully remove `lodash` (was still being used in index)

## 3.1.0 / 1.2.0

- Add support for array and number paths
- Remove `lodash` in favor of `kari` for better speed and footprint

## 3.0.0

- Update to use the `3.x.x` branch of `reselect`
- Update versioning schema to have the major version match that of the `reselect` dependency it uses

## 1.1.1

- Update dependencies for `1.x.x` branch in lead up to major version change

## 1.1.0

- Add default getComputedvalue function ([identity](https://lodash.com/docs/4.17.4#identity))

## 1.0.0

- Initial release
