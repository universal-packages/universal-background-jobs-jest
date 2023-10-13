# Background Jobs Jest

[![npm version](https://badge.fury.io/js/@universal-packages%2Fbackground-jobs-jest.svg)](https://www.npmjs.com/package/@universal-packages/background-jobs-jest)
[![Testing](https://github.com/universal-packages/universal-background-jobs-jest/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-background-jobs-jest/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-background-jobs-jest/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-background-jobs-jest)

Jest matchers for [Background Jobs](https://github.com/universal-packages/universal-background-jobs) testing.

## Install

```shell
npm install @universal-packages/background-jobs-jest

npm install @universal-packages/background-jobs
```

## Setup

Add the following to your `jest.config.js` or where you configure Jest:

```js
module.exports = {
  setupFilesAfterEnv: ['@universal-packages/background-jobs-jest']
}
```
## Matchers

### toHaveBeenEnqueued

```js
import { MyJob } from './MyJob'

it('should enqueue MyJob', async () => {
  await MyJob.performLater()

  expect(MyJob).toHaveBeenEnqueued()
})
```

### toHaveBeenEnqueuedWith

```js
import { MyJob } from './MyJob'

it('should enqueue MyJob with payload', async () => {
  await MyJob.performLater({ id: 1 })

  expect(MyJob).toHaveBeenEnqueuedWith({ id: 1 })
})
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
