import { Worker } from '@universal-packages/background-jobs'
import { sleep } from '@universal-packages/time-measurer'
import stripAnsi from 'strip-ansi'

import '../src'
import ExcellentJob from './__fixtures__/Excellent.job'
import GoodJob from './__fixtures__/Good.job'

describe('toHaveBeenEnqueuedWith', (): void => {
  it('asserts a job being enqueued with a payload', async (): Promise<void> => {
    const worker = new Worker({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await worker.prepare()
    await worker.queue.clear()

    await GoodJob.performLater({ good: true })

    await worker.run()

    await sleep(200)

    await worker.stop()
    await worker.release()

    expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    expect(GoodJob).not.toHaveBeenEnqueuedWith({ good: false })
    expect(ExcellentJob).not.toHaveBeenEnqueuedWith({ excellent: true })
  })

  it('fails and shows if a job was not enqueued with a payload', async (): Promise<void> => {
    const worker = new Worker({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await worker.prepare()
    await worker.queue.clear()

    await worker.run()

    await sleep(200)

    await worker.stop()
    await worker.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" to have been enqueued with {"good": true} but the it was not enqueued any times')
  })

  it('fails and shows the if a job was not enqueued with a payload and tells which ones where', async (): Promise<void> => {
    const worker = new Worker({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await worker.prepare()
    await worker.queue.clear()

    await GoodJob.performLater({ excellent: true })

    await worker.run()

    await sleep(200)

    await worker.stop()
    await worker.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual(
      'expected "GoodJob" to have been enqueued with {"good": true} but job was enqueued with:\n"- Expected\n+ Received·\n  Object {\n-   \\"good\\": true,\n+   \\"excellent\\": true,\n  }"'
    )
  })

  it('fails and shows the if a job was enqueued with a payload but it was not expected', async (): Promise<void> => {
    const worker = new Worker({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await worker.prepare()
    await worker.queue.clear()

    await GoodJob.performLater({ good: true })

    await worker.run()

    await sleep(200)

    await worker.stop()
    await worker.release()

    let error: Error

    try {
      expect(GoodJob).not.toHaveBeenEnqueuedWith({ good: true })
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" not to have been enqueued with {"good": true}, bit it was')
  })
})
