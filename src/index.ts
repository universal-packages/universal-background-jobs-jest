import { expect } from '@jest/globals'
import { BaseJob, TestQueue } from '@universal-packages/background-jobs'

import './globals'

TestQueue.setMock(jest.fn())

beforeEach(() => {
  TestQueue.mock.mockClear()
})

function toHaveBeenEnqueued(job: BaseJob) {
  const calls = TestQueue.mock.mock.calls

  const pass = calls.some((call: any[]) => {
    const [jobName] = call

    return jobName === job['name']
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued, bit it was`,
      pass: true
    }
  } else {
    return {
      message: () => {
        if (calls.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but no enqueues were found`
        } else {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued but enqueues were: ${calls
            .map((call: any[]) => this.utils.printExpected(call[0]))
            .join(', ')}`
        }
      },

      pass: false
    }
  }
}

function toHaveBeenEnqueuedWith(job: BaseJob, payload: any) {
  const calls = TestQueue.mock.mock.calls
  const jobCalls = calls.filter((call: any[]) => call[0] === job['name'])

  const pass = jobCalls.some((call: any[]) => {
    const [_jobName, _queue, jobPayload] = call

    if (jobPayload === payload) return true

    if (typeof jobPayload === 'object' && typeof payload === 'object') return this.utils.stringify(jobPayload) === this.utils.stringify(payload)
  })

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(job['name'])} not to have been enqueued with ${this.utils.printReceived(payload)}, bit it was`,
      pass: true
    }
  } else {
    return {
      message: () => {
        if (jobCalls.length === 0) {
          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued with ${this.utils.printReceived(payload)} but the it was not enqueued any times`
        } else {
          const jobCallsToPrint = jobCalls
            .map((call: any[]) => {
              const [_jobName, _queue, jobPayload] = call

              if (typeof jobPayload === 'object' && typeof payload === 'object') return this.utils.printExpected(this.utils.diff(payload, jobPayload))

              return this.utils.printExpected(jobPayload)
            })
            .join('\n\n')

          return `expected ${this.utils.printReceived(job['name'])} to have been enqueued with ${this.utils.printReceived(payload)} but job was enqueued with:\n${jobCallsToPrint}`
        }
      },

      pass: false
    }
  }
}

expect.extend({
  toHaveBeenEnqueued,
  toHaveBeenEnqueuedWith
})
