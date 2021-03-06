import React from 'react'
import { withFormik, Form } from 'formik'
import { Input, Field, FormGroup, Select, Toggle } from 'components/FormFields'
import Button from 'components/Button/Button'

import * as AudioFileExtensions from 'shared/constants/AudioFileExtension'
import * as Yup from 'yup'
import DownloadLocation from '../DownloadsLocation/DownloadsLocation'
import Icon from 'components/Icon/Icon'
import IconReset from 'icons/Reset.svg'
import styles from './SettingsForm.scss'
import Spinner from 'components/Spinner/Spinner'

const validationSchema = Yup.object().shape({
  searchFileExtensions: Yup
    .array()
    .min(1, 'You need at least 1 file extension for searching')
    .required(),
  searchDurationInSeconds: Yup
    .number()
    .min(3, 'You cannot search for less than 3 seconds, there would be no results otherwise')
    .max(60, 'You cannot search for longer than 60 seconds, it would take too long')
    .required('Search duration is required')
})

const fileExtensionOptions = Object
  .values(AudioFileExtensions)
  .map(i => {
    return {
      label: i,
      value: i
    }
  })

const SettingsForm = React.memo(({
  handleSubmit,
  onResetClick,
  isResetting
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <DownloadLocation />
      <FormGroup parent>
        <FormGroup>
          <Field
            submitOnChange
            helper='Enable this if you only want to show 320kbps mp3s in the search results'
            name='searchHasOnlyHighBitrate'
            label='Show high quality mp3 only'
            component={Toggle}
          />
        </FormGroup>
        <FormGroup>
          <Field
            submitOnChange
            isMulti
            isClearable={false}
            options={fileExtensionOptions}
            name='searchFileExtensions'
            label='Search file types'
            placeholder='Select your search file types'
            component={Select}
          />
        </FormGroup>
        <FormGroup>
          <Field
            submitOnBlur
            min={1}
            max={25}
            type='number'
            name='searchDurationInSeconds'
            label='Search duration (in seconds)'
            placeholder='Select search duration'
            component={Input}
          />
        </FormGroup>
      </FormGroup>
      <FormGroup parent>
        <Button
          onClick={onResetClick}
          size='sm'
          variant='error'
          iconAfter={isResetting ? (
            <div className={styles.btnResetLoading}>
              <Spinner />
            </div>
          ) : (
            <Icon
              className={styles.btnResetIcon}
              glyph={IconReset}
            />
          )}
        >
          Reset and reconnect
        </Button>
      </FormGroup>
    </Form>
  )
})

const mapPropsToValues = ({
  settings
}) => {
  return {
    searchHasOnlyHighBitrate: settings?.get('searchHasOnlyHighBitrate'),
    searchFileExtensions: settings?.get('searchFileExtensions').toArray(),
    searchDurationInSeconds: (settings?.get('searchDuration') / 1000)
  }
}

const mapValuesToSubmit = ({
  searchDurationInSeconds,
  ...values
}) => {
  return {
    searchDuration: searchDurationInSeconds * 1000,
    ...values
  }
}

export default withFormik({
  validationSchema,
  mapPropsToValues,
  displayName: 'SettingsForm',
  handleSubmit: (values, { props }) => {
    props.onSubmit(mapValuesToSubmit(values))
  }
})(SettingsForm)
