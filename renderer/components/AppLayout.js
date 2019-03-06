// Stylesheet imports
import '../styles/reset.css'
import '../styles/app.css'





// Module imports
import Head from 'next/head'
import Error from 'next/error'
import NProgress from 'nprogress'
import React from 'react'
import Router from 'next/router'





// Local imports
import { Banner } from '.'





NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())





class AppLayout extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ Component, ctx }) {
    const {
      asPath,
      isServer,
      query,
    } = ctx

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    let statusCode = 200

    if (ctx.res) {
      ({ statusCode } = ctx.res)
    }

    return {
      statusCode,
      pageProps: {
        asPath,
        isServer,
        query,
        ...pageProps,
      },
    }
  }

  render () {
    const {
      Component,
      pageProps,
      statusCode,
    } = this.props

    return (
      <div role="application">
        {/* <Head>
          <link rel="stylesheet" href="/static/scss/reset.scss" />
          <link rel="stylesheet" href="/static/scss/libraries.scss" />
          <link rel="stylesheet" href="/static/scss/app.scss" />
        </Head> */}

        <link
          href={`//fonts.googleapis.com/css?family=${['Press Start 2P'].join('|').replace(/\s/g, '+')}`}
          rel="stylesheet" />

        {(statusCode === 200) && (
          <Component {...pageProps} />
        )}

        {(statusCode !== 200) && (
          <main className="fade-in page error">
            <div className="page-content">
              <Error statusCode={statusCode} />
            </div>
          </main>
        )}
      </div>
    )
  }
}





export { AppLayout }
