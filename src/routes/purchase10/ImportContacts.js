import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import { PurchaseActions, ContactsImporting, SectionHeader } from '../../components'
import cn from 'classnames'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import ColumnsMapping from './ColumnsMapping'

class ImportContacts extends React.Component {
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  handleSubmit() {
    if (this.ref_mapping)
      return this.ref_mapping.handleSubmit();
    return false;
  }
  render() {
    const { mappingColumns, flowIndex, intl } = this.props

    return mappingColumns ? (
      <ColumnsMapping onRef={ref => (this.ref_mapping = ref)} refreshPage={this.props.refreshPage} />
    ) : (
        <ContactsImporting >
          {({
            exportFromXLSX,
            exportGoogleContacts,
            exportOutlookContacts,
            exportCardContacts,
            csvUploadButton,
            xlsUploadButton,
            xlsxUploadButton,
            vcfUploadButton,
          }) =>
            <React.Fragment>
              <div className={s.content}>
                <SectionHeader
                  header={intl.formatMessage(messages.header)}
                  number={flowIndex + 1}
                  prefixClassName={s.headerPrefix}
                />
                <Row gutter={20} type='flex' align='center'>
                  <Col xs={24} sm={12} className={s.section}>
                    {exportGoogleContacts}
                    {exportOutlookContacts}
                    {exportCardContacts}
                  </Col>
                  <Col xs={24} sm={12} className={s.section}>
                    {exportFromXLSX}
                  </Col>
                </Row>
                <Row type='flex' gutter={20}>
                  <Col xs={24} md={6}>
                    {csvUploadButton}
                  </Col>
                  <Col xs={24} md={6}>
                    {xlsUploadButton}
                  </Col>
                  <Col xs={24} md={6}>
                    {xlsxUploadButton}
                  </Col>
                  <Col xs={24} md={6}>
                    {vcfUploadButton}
                  </Col>
                </Row>
              </div>
            </React.Fragment>
          }
        </ContactsImporting>
      )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
  mappingColumns: state.contacts.mappingColumns,
})

const mapDispatch = {

}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
