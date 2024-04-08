import { expect } from '@jest/globals'
import { BaseJob, TestQueue } from '@universal-packages/background-jobs'

import './globals'

beforeEach(() => {
  TestQueue.reset()
})

function toHaveBeenEnqueued(job: BaseJob): jest.CustomMatcherResult {
  const enqueueRequests = TestQueue.enqueueRequests

  const pass = enqueueRequests.some((enqueueRequest) => {
    return enqueueRequest.item.name === job['name']
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued, bit it was`,
      pass
    }
  } else {
    return {
      message: () => {
        if (enqueueRequests.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but no enqueues were made`
        } else {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but it was not\n\nEnqueues were: ${enqueueRequests
            .map((enqueueRequest) => this.utils.printExpected(enqueueRequest.item.name))
            .join(', ')}`
        }
      },
      pass
    }
  }
}

function toHaveBeenEnqueuedWith(job: BaseJob, payload: any): jest.CustomMatcherResult {
  const enqueueRequests = TestQueue.enqueueRequests
  const jobEnqueueRequests = enqueueRequests.filter((enqueueRequest) => enqueueRequest.item.name === job['name'])

  const pass = jobEnqueueRequests.some((jobEnqueueRequest) => {
    return this.equals(jobEnqueueRequest.item.payload, payload)
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued with the given payload, bit it was`,
      pass
    }
  } else {
    return {
      message: () => {
        if (jobEnqueueRequests.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued, but it was not enqueued at all`
        } else {
          const jobCallsToPrint = jobEnqueueRequests
            .map((enqueueRequest) => {
              return this.utils.diff(payload, enqueueRequest.item.payload)
            })
            .join('\n\n')

          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued with the given payload but it was not\n\nEnqueue payloads were:\n${jobCallsToPrint}`
        }
      },
      pass
    }
  }
}

expect.extend({
  toHaveBeenEnqueued,
  toHaveBeenEnqueuedWith
})
