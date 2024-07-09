import { BackgroundJobs } from '@universal-packages/background-jobs'
import { sleep } from '@universal-packages/time-measurer'
import stripAnsi from 'strip-ansi'

import '../src'
import ExcellentJob from './__fixtures__/Excellent.job'
import GoodJob from './__fixtures__/Good.job'

describe('toHaveBeenEnqueued', (): void => {
  it('asserts a job being enqueued', async (): Promise<void> => {
    const backgroundJobs = new BackgroundJobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await backgroundJobs.prepare()
    await backgroundJobs.queue.clear()

    await GoodJob.performLater({ good: true })

    await backgroundJobs.run()

    await sleep(200)

    await backgroundJobs.stop()
    await backgroundJobs.release()

    expect(GoodJob).toHaveBeenEnqueued()
    expect(ExcellentJob).not.toHaveBeenEnqueued()
  })

  it('fails and shows if a job was not enqueued', async (): Promise<void> => {
    const backgroundJobs = new BackgroundJobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await backgroundJobs.prepare()
    await backgroundJobs.queue.clear()

    await backgroundJobs.run()

    await sleep(200)

    await backgroundJobs.stop()
    await backgroundJobs.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueued()
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" to have been enqueued but no enqueues were made')
  })

  it('fails and shows the if a job was not enqueued and tells which ones where', async (): Promise<void> => {
    const backgroundJobs = new BackgroundJobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await backgroundJobs.prepare()
    await backgroundJobs.queue.clear()

    await ExcellentJob.performLater({ excellent: true })

    await backgroundJobs.run()

    await sleep(200)

    await backgroundJobs.stop()
    await backgroundJobs.release()

    let error: Error

    try {
      expect(GoodJob).toHaveBeenEnqueued()
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "GoodJob" to have been enqueued but it was not\n\nEnqueues were: "ExcellentJob"')
  })

  it('fails and shows the if a job was enqueued but it was not expected', async (): Promise<void> => {
    const backgroundJobs = new BackgroundJobs({ jobsLocation: './tests/__fixtures__', waitTimeIfEmptyRound: 0 })

    await backgroundJobs.prepare()
    await backgroundJobs.queue.clear()

    await ExcellentJob.performLater({ excellent: true })

    await backgroundJobs.run()

    await sleep(200)

    await backgroundJobs.stop()
    await backgroundJobs.release()

    let error: Error

    try {
      expect(ExcellentJob).not.toHaveBeenEnqueued()
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected "ExcellentJob" not to have been enqueued, bit it was')
  })
})
