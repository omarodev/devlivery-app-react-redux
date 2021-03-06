import React from 'react'
import Purchase7 from './Purchase7'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {buyMoreGift,getGifts} from '../../reducers/purchase';

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(buyMoreGift());
  store.dispatch(getGifts({},true))
  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase7 intl={intl}/>,
    actions: null
  }
}

export default action
