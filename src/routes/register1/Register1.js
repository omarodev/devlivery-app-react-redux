import React from 'react'
import {connect} from 'react-redux'
import {INDIVIDUAL_ACCOUNT, setAccountType, TEAM_ACCOUNT} from '../../reducers/register'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register1.css'
import {Actions, Card, Link, SectionHeader} from '../../components'
import {REGISTER2_ROUTE} from '../'
import IndividualIcon from '../../static/individual.svg'
import TeamIcon from '../../static/team.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import history from '../../history'
import {generateUrl} from '../../router'
import messages from './messages'

class Register1 extends React.Component {
  render() {
    const {setAccountType, accountType, intl} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={1}
            prefixClassName={s.headerPrefix}
          />
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card
                className={s.item}
                title={intl.formatMessage(messages.individual)}
                onClick={() => setAccountType(INDIVIDUAL_ACCOUNT)}
                active={accountType === INDIVIDUAL_ACCOUNT}
                keyValue='a'
                svg={IndividualIcon}
              />
              <p className={s.description}>
                {intl.formatMessage(messages.individualDescription)}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                className={s.item}
                title={intl.formatMessage(messages.team)}
                onClick={() => setAccountType(TEAM_ACCOUNT)}
                active={accountType === TEAM_ACCOUNT}
                keyValue='b'
                svg={TeamIcon}
              />
              <p className={s.description}>
                {intl.formatMessage(messages.teamDescription)}
              </p>
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => accountType && history.push(generateUrl(REGISTER2_ROUTE))}
          />
          <Link to={REGISTER2_ROUTE} disabled={!accountType}>
            <Button type='primary'>
              {intl.formatMessage(messages.submit)}
            </Button>
          </Link>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  accountType: state.register.accountType,
})

const mapDispatch = {
  setAccountType,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Register1))
