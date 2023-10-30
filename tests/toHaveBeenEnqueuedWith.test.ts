import { Jobs } from '@universal-packages/background-jobs'
import { sleep } from '@universal-packages/time-measurer'
import stripAnsi from 'strip-ansi'

import '../src'
import ExcellentJob from './__fixtures__/Excellent.job'
import GoodJob from './__fixtures__/Good.job'

describe('toHaveBeenEnqueuedWith', (): void => {
  it('asserts a job being enqueued with a payload', async (): Promise<void> => {
    const jobs = new Jobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await jobs.prepare()
    await jobs.queue.clear()

    await GoodJob.performLater({ good: true })

    await jobs.run()

    await sleep(200)

    await jobs.stop()
    await jobs.release()

    expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    expect(GoodJob).not.toHaveBeenEnqueuedWith({ good: false })
    expect(ExcellentJob).not.toHaveBeenEnqueuedWith({ excellent: true })
  })

  it('fails and shows if a job was not enqueued with a payload', async (): Promise<void> => {
    const jobs = new Jobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await jobs.prepare()
    await jobs.queue.clear()

    await jobs.run()

    await sleep(200)

    await jobs.stop()
    await jobs.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" to have been enqueued, but it was not enqueued at all')
  })

  it('fails and shows the if a job was not enqueued with a payload and tells which ones where', async (): Promise<void> => {
    const jobs = new Jobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await jobs.prepare()
    await jobs.queue.clear()

    await GoodJob.performLater({ excellent: true })

    await jobs.run()

    await sleep(200)

    await jobs.stop()
    await jobs.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual(
      'expected "GoodJob" to have been enqueued with the given payload but it was not\n\nEnqueue payloads were:\n- Expected\n+ Received\n\n  Object {\n-   "good": true,\n+   "excellent": true,\n  }'
    )
  })

  it('fails and shows the if a job was enqueued with a payload but it was not expected', async (): Promise<void> => {
    const jobs = new Jobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await jobs.prepare()
    await jobs.queue.clear()

    await GoodJob.performLater({ good: true })

    await jobs.run()

    await sleep(200)

    await jobs.stop()
    await jobs.release()

    let error: Error

    try {
      expect(GoodJob).not.toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" not to have been enqueued with the given payload, bit it was')
  })
})
