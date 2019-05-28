const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const { createSendAndWait } = require('../utils/handlers')
const Channel = require('../constants/Channel')
const slsk = require('../utils/slsk')
const settings = require('../utils/settings')
const StreamSpeed = require('streamspeed')
const notifications = require('../utils/notifications')
const fsUtils = require('../utils/fs')
const debug = require('debug')('tunepack:download')

const PROGRESS_INTERVAL = 250
const SPEED_INTERVAL = 200

const getErrorMessage = () => {
  return 'Something has gone wrong.'
}

const downloadTrack = async ({
  downloadPath,
  track,
  onProgress,
  onSpeed
}) => {
  return new Promise(async (resolve, reject) => {
    const writeStream = fs.createWriteStream(downloadPath)

    const totalSize = track.size
    let uploadedSize = 0

    const downloadStream = await slsk.downloadStream({
      file: track
    })

    const throttledOnSpeed = _.throttle((speed, avgSpeed) => {
      onSpeed(avgSpeed)
    }, SPEED_INTERVAL)

    let ss = new StreamSpeed()
    ss.add(downloadStream)
    ss.on('speed', (speed, avgSpeed) => {
      throttledOnSpeed(speed, avgSpeed)
    })

    const throttledOnProgress = _.throttle(() => {
      const progress = (uploadedSize / totalSize * 100).toFixed(2)
      onProgress(progress)
    }, PROGRESS_INTERVAL)

    downloadStream.on('data', (chunk) => {
      const { length: chunkLength } = chunk
      uploadedSize += chunkLength
      throttledOnProgress()
      writeStream.write(chunk)
    })

    downloadStream.on('error', (error) => {
      reject(error)
    })

    downloadStream.on('end', () => {
      writeStream.end()

      resolve({
        downloadPath
      })
    })
  })
}

const getUniqueDownloadPath = async (track) => {
  const downloadsDir = settings.getDownloadsDir()
  const downloadPath = path.resolve(downloadsDir, `${track.fileName}.${track.fileExtension}`)

  const isDownloadPathTaken = await fsUtils.getDoesFileExist(downloadPath)

  if (!isDownloadPathTaken) {
    return downloadPath
  }

  const newDownloadPath = path.resolve(downloadsDir, `${track.fileName}_${track.id}.${track.fileExtension}`)

  debug(`Download path was taken, new download path is: ${newDownloadPath}`)

  return newDownloadPath
}

createSendAndWait(Channel.DOWNLOAD, async (event, track) => {
  try {
    const handleProgress = progress => {
      settings.updateDownloadHistoryEntry(track.id, {
        progress: String(progress)
      })

      event.reply(Channel.DOWNLOAD_PROGRESS, {
        track,
        progress
      })
    }

    const handleSpeed = avgSpeed => {
      settings.updateDownloadHistoryEntry(track.id, {
        avgSpeed
      })

      event.reply(Channel.DOWNLOAD_SPEED, {
        track,
        avgSpeed
      })
    }

    const downloadPath = await getUniqueDownloadPath(track)

    settings.addToDownloadHistory({
      track,
      downloadPath,
      isDownloading: true,
      isDownloaded: false,
      error: ''
    })

    await downloadTrack({
      downloadPath,
      track,
      onProgress: handleProgress,
      onSpeed: handleSpeed
    })

    settings.updateDownloadHistoryEntry(track.id, {
      isDownloading: false,
      isDownloaded: true
    })

    event.reply(Channel.DOWNLOAD_COMPLETE, {
      track,
      downloadPath
    })

    notifications.showDownloadedNotification({
      track,
      downloadPath
    })

    return {
      downloadPath
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    settings.updateDownloadHistoryEntry(track.id, {
      isDownloading: false,
      isDownloaded: false,
      error: errorMessage
    })

    event.reply(Channel.DOWNLOAD_ERROR, {
      track,
      errorMessage
    })

    throw error
  }
})
