import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '@/config/apolloClient'
import { SessionProvider } from 'next-auth/react'

import Layout from '@/components/Layout'

import '@/styles/reset.css'
import '@/styles/globals.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      {/* <style jsx global>{`
        :root {
        }
      `}</style> */}
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SessionProvider>
    </>
  )
}
