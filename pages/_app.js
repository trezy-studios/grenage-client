// Module imports
import { Provider } from 'react-redux'
import { DragDropContextProvider } from 'react-dnd';
import App, { Container } from 'next/app'
import HTML5Backend from 'react-dnd-html5-backend'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Local imports
import { initStore } from '../store'
import { AppLayout } from '../components'





@withRedux(initStore)
class NextApp extends App {
  static getInitialProps (appProps) {
    return AppLayout.getInitialProps(appProps)
  }

  render () {
    const {
      store,
    } = this.props

    return (
      <Container>
        <Provider store={store}>
          <DragDropContextProvider backend={HTML5Backend}>
            <AppLayout {...this.props} />
          </DragDropContextProvider>
        </Provider>
      </Container>
    )
  }
}





export default NextApp
