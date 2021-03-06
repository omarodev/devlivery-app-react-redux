import React from 'react'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CardStore.css'
import messages from './messages'
import debounce from 'lodash/debounce'
import { CARD_IMAGES_PROP, CARD_SIZES, DEFAULT_DEBOUNCE_TIME } from '../../constants'
import { clearFilters, getCards, getOccasions, clear } from '../../reducers/cards'
import { setFlowFromSelectCard } from '../../reducers/purchase';
import { Button, Col, Input, Pagination, Row, Select, Modal, Carousel } from 'antd'
import { Card, PaginationItem,CardDetails } from '../../components'
import cn from 'classnames'
import { getItemImage } from '../../utils'
import PlusIcon from '../../static/plus.svg'

class CardStore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
      showCardDetails: false,
      cardDetails: null
    }

    this.getCards = debounce(this.props.getCards, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({ search })
    this.getCards({ search })
  }

  render() {
    const { search, cardDetails } = this.state
    const {
      cards,
      cardsCount,
      getCards,
      intl,
      page,
      pageSize,
      cardStyles,
      occasions,
      getOccasions,
      occasionTypes,
      loading,
      clearFilters,
      occasion,
      cardSize,
      cardStyle,
      setFlowFromSelectCard
    } = this.props
    var occasionByCardId = null;
    if (cardDetails && occasions)
      occasionByCardId = occasions.filter(item => item.id === cardDetails.occasion_id);

    return (
      <div className={s.container}>
        <div className={s.filters}>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.occasion)}</h3>
            <Select
              className={s.occasionType}
              allowClear
              placeholder={intl.formatMessage(messages.occasionType)}
              onChange={(occasionType) => getOccasions({ occasionType })}
            >
              {occasionTypes.map(item =>
                <Select.Option key={item} value={item}>{item}</Select.Option>
              )}
            </Select>
            <ul className={s.filterItems}>
              {occasions.filter(item => item.on_card_store).map((item) =>
                <li key={item.id}>
                  <a
                    onClick={() => {
                      window.scrollTo(0, 0)
                      getCards({ occasion: item.id })
                    }}
                    className={cn(item.id === occasion && s.selected, !item.has_cards && s.disabled)}
                  >
                    {item.title}
                  </a>
                </li>
              )}
            </ul>
          </section>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.size)}</h3>
            <ul className={s.filterItems}>
              {CARD_SIZES(intl).map((item) =>
                <li key={item.key}>
                  <a
                    onClick={() => {
                      window.scrollTo(0, 0)
                      getCards({ cardSize: item.key })
                    }}
                    className={cn(item.key === cardSize && s.selected)}
                  >
                    {`${item.extra} ${item.title}`}
                  </a>
                </li>
              )}
            </ul>
          </section>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.style)}</h3>
            <ul className={s.filterItems}>
              {cardStyles.map((item) =>
                <li key={item.title}>
                  <a
                    onClick={() => {
                      window.scrollTo(0, 0)
                      getCards({ cardStyle: item.title })
                    }}
                    className={cn(item.title === cardStyle && s.selected)}
                  >
                    {item.title}
                  </a>
                </li>
              )}
            </ul>
          </section>
        </div>
        <div className={s.content}>
          <div className={s.actionsContainer}>
            <div className={s.actions}>
              <Input.Search
                placeholder={intl.formatMessage(messages.search)}
                value={search}
                onChange={this.changeSearch}
              />
              <Button
                className={s.clearFilters}
                type='primary'
                ghost
                onClick={()=>{
                  this.setState({search:''});
                  clearFilters();
                }}
              >
                {intl.formatMessage(messages.clearFilters)}
              </Button>
            </div>
          </div>
          {!!cards.length ? (
            <Row gutter={20}>
              {cards.map((item) =>
                <Col key={item.id} xs={24} sm={12} md={8} className={s.itemWrapper}>
                  <Card
                    item={item}
                    imagesProp={CARD_IMAGES_PROP}
                    title={
                      <React.Fragment>
                        {item.title}
                        <br />
                        <span className={s.price}>
                          {item.price_with_tax}
                          <span className={s.currency}>{item.currency}</span>
                        </span>
                      </React.Fragment>
                    }
                    bordered={false}
                    description={item.description}
                    onClick={() => {
                      //setFlowFromSelectCard(item);
                      this.setState({ showCardDetails: true, cardDetails: item });
                    }}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.cards ? (
            <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
          ) : null}
          {!!cards.length && (
            <div className={s.footer}>
              <Pagination
                hideOnSinglePage
                current={page}
                total={cardsCount}
                pageSize={pageSize}
                onChange={(current) => getCards({ pagination: { current } })}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el} />}
              />
            </div>
          )}
        </div>
        {
          this.state.showCardDetails && cardDetails &&
          <CardDetails
            intl={intl}
            cardDetails={cardDetails}
            occasionTitle={occasionByCardId && occasionByCardId.length > 0 && occasionByCardId[0].title}
            visible={this.state.showCardDetails}
            setVisible={(visible)=>this.setState({showCardDetails:visible})}
            makeorder={(cardDetails)=>setFlowFromSelectCard(cardDetails)}
          />
        }
      </div>
    )
  }
}

const mapState = state => ({
  ...state.cards,
})

const mapDispatch = {
  getCards,
  getOccasions,
  clearFilters,
  clear,
  setFlowFromSelectCard
}

export default connect(mapState, mapDispatch)(withStyles(s)(CardStore))
