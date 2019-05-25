import React from 'react'
import View from 'components/View/View'
import Title from 'components/Title/Title'
import { connect } from 'react-redux'
import ResultsList from 'components/ResultsList/ResultsList'
import { getDownloadsList } from 'selectors/downloads'

const DownloadsView = React.memo(({
  items
}) => {
  return (
    <View
      header={(
        <Title>
          Downloads
        </Title>
      )}
    >
      <ResultsList
        items={items}
      />
    </View>
  )
})

const mapStateToProps = state => ({
  items: getDownloadsList(state)
})

export default connect(
  mapStateToProps
)(DownloadsView)
