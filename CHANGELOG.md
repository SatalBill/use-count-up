# Change Log

## 2.0.0 (May 18th, 2020)

**Breaking Changes**

- The hook now returns an object with two props: `value` and `reset`. `value` is the current count up value; `reset` is a method that reset the animation when it is fired
- The hook now accepts a single object as an argument with all props to configure the animation.

**Implemented enhancements:**

- The library exports also Count up component. The component is using the hook internally.
- Support `toLocaleString` with fallback options
- Add bunch of props to configure the output value
- Rewrite the source code using TypeScript
- Support React Native

## 1.0.4 (Nov 27th, 2019)

**Minor changes:**

- Update TypeScript type definitions

## 1.0.3 (Nov 24th, 2019)

**Minor changes:**

- Update Readme

## 1.0.2 (Nov 24th, 2019)

**Implemented enhancements:**

- Add TypeScript type definitions

## 1.0.1 (Nov 13th, 2019)

**Minor changes:**

- Update .gitignore, .npmignore and Readme

## 1.0.0 (Oct 6th, 2019)

**Implemented enhancements:**

- Init the project with simple hook and returns the count up value
