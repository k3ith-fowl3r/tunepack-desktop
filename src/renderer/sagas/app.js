import { all, takeLatest, put, call } from 'redux-saga/effects'
import actions, {
  constants
} from 'actions/app'

import handlers from 'handlers'

export function * onReload () {
  yield put(actions.reloadRequest.start())

  try {
    yield call(handlers.reload)
    yield put(actions.reloadRequest.success())
  } catch (res) {
    yield put(actions.reloadRequest.error(res.error))
  }
}

export function * onReset () {
  yield put(actions.resetRequest.start())

  try {
    yield call(handlers.reset)
  } catch (res) {
    yield put(actions.resetRequest.error(res.error))
  }
}

export default function * watchSettings () {
  yield all([
    takeLatest(constants.RELOAD, onReload),
    takeLatest(constants.RESET, onReset)
  ])
}
