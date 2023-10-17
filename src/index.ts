import { expect } from '@jest/globals'
import { BaseJob, TestQueue } from '@universal-packages/background-jobs'

import './globals'

TestQueue.setMock(jest.fn())

beforeEach(() => {
  TestQueue.mock.mockClear()
})

function toHaveBeenEnqueued(job: BaseJob): jest.CustomMatcherResult {
  const calls = TestQueue.mock.mock.calls

  const pass = calls.some((call: any[]) => {
    const [jobName] = call

    return jobName === job['name']
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued, bit it was`,
      pass
    }
  } else {
    return {
      message: () => {
        if (calls.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but no enqueues were made`
        } else {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but it was not\n\nEnqueues were: ${calls
            .map((call: any[]) => this.utils.printExpected(call[0]))
            .join(', ')}`
        }
      },
      pass
    }
  }
}

function toHaveBeenEnqueuedWith(job: BaseJob, payload: any): jest.CustomMatcherResult {
  const calls = TestQueue.mock.mock.calls
  const jobCalls = calls.filter((call: any[]) => call[0] === job['name'])

  const pass = jobCalls.some((call: any[]) => {
    const [_jobName, _queue, jobPayload] = call

    return this.equals(jobPayload, payload)
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued with the given payload, bit it was`,
      pass
    }
  } else {
    return {
      message: () => {
        if (jobCalls.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued, but it was not enqueued at all`
        } else {
          const jobCallsToPrint = jobCalls
            .map((call: any[]) => {
              const [_jobName, _queue, jobPayload] = call

              return this.utils.diff(payload, jobPayload)
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
