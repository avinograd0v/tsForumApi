/**
 * Created by andreivinogradov on 13.03.17.
 */
import * as os from 'os'
import * as fs from 'fs'
import * as pgMonitor from 'pg-monitor'

pgMonitor.setTheme('matrix')

const $DEV = process.env.NODE_ENV === 'development'

const logFile = './db/errors.log'

pgMonitor.setLog((msg: any, info: any) => {

  if (info.event === 'error') {

    let logText = os.EOL + msg

    if (info.time) {
      logText = os.EOL + logText
    }

    fs.appendFileSync(logFile, logText)
  }

  if (!$DEV) {
    info.display = false
  }

})

let attached = false

export = {

  init: (options: any) => {
    if (attached) {
      return
    }
    attached = true

    if ($DEV) {
      pgMonitor.attach(options)

    } else {
      pgMonitor.attach(options, ['error'])
    }
  },

  done: () => {
    if (attached) {
      attached = false
      pgMonitor.detach()
    }
  }
}
