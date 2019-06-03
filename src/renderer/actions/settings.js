import { createAction, createRequestTypes, createRequestAction } from 'utils/redux'

export const INITIALIZE = '@settings/INITIALIZE'
export const INITIALIZE_REQUEST = createRequestTypes('@settings/INITIALIZE_REQUEST')

export const SELECT_DIR = '@settings/SELECT_DIR'
export const SELECT_DIR_REQUEST = createRequestTypes('@settings/SELECT_DIR_REQUEST')

export const SET_SETTINGS = '@settings/SET_SETTINGS'
export const SET_SETTINGS_REQUEST = createRequestTypes('@settings/SET_SETTINGS_REQUEST')
export const SELECT_DOWNLOAD_DIR = '@settings/SELECT_DOWNLOAD_DIR'

export const ON_UPDATE_SETTINGS = '@settings/ON_UPDATE_SETTINGS'

export const TOGGLE_IS_BURNING = '@settings/TOGGLE_IS_BURNING'
export const TOGGLE_DOWNLOAD_SELECT_ALL = '@settings/TOGGLE_DOWNLOAD_SELECT_ALL'
export const TOGGLE_DOWNLOAD_SELECT_BURNING = '@settings/TOGGLE_DOWNLOAD_SELECT_BURNING'

export const constants = {
  INITIALIZE,
  INITIALIZE_REQUEST,
  SELECT_DIR,
  SELECT_DIR_REQUEST,
  SET_SETTINGS,
  SET_SETTINGS_REQUEST,
  SELECT_DOWNLOAD_DIR,
  ON_UPDATE_SETTINGS,
  TOGGLE_IS_BURNING,
  TOGGLE_DOWNLOAD_SELECT_BURNING,
  TOGGLE_DOWNLOAD_SELECT_ALL
}

export const initialize = createAction(INITIALIZE)
export const initializeRequest = createRequestAction(INITIALIZE_REQUEST)

export const selectDir = createAction(SELECT_DIR)
export const selectDirRequest = createRequestAction(SELECT_DIR_REQUEST)

export const setSettings = createAction(SET_SETTINGS)
export const setSettingsRequest = createRequestAction(SET_SETTINGS_REQUEST)

export const selectDownloadDir = createAction(SELECT_DOWNLOAD_DIR)

export const onUpdateSettings = createAction(ON_UPDATE_SETTINGS)

export const toggleIsBurning = createAction(TOGGLE_IS_BURNING)
export const toggleDownloadSelectBurning = createAction(TOGGLE_DOWNLOAD_SELECT_BURNING)
export const toggleDownloadSelectAll = createAction(TOGGLE_DOWNLOAD_SELECT_ALL)

export default {
  initialize,
  initializeRequest,
  selectDir,
  selectDirRequest,
  setSettings,
  setSettingsRequest,
  selectDownloadDir,
  onUpdateSettings,
  toggleIsBurning,
  toggleDownloadSelectBurning,
  toggleDownloadSelectAll
}
