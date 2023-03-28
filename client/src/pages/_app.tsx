import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '@/config/apolloClient'

import Layout from '@/components/Layout'

import '@/styles/reset.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <style jsx global>{`
        :root {
        }
      `}</style> */}
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </>
  )
}
