declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenEnqueued(): R
      toHaveBeenEnqueuedWith(payload: any): R
    }
  }
}

export {}
