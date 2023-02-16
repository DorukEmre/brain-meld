import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '@/config/apolloClient'

import Layout from '@/components/Layout'

import '@/styles/reset.css'
import '@/styles/globals.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available, or use default with <Layout />
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return getLayout(
    <>
      <style jsx global>{`
        :root {
        }
      `}</style>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>,
  )
}
