import Image from 'next/image'
import type { NextPageWithLayout } from '@/pages/_app'
import HTMLMetaTags from '@/components/HTMLMetaTags'

type Props = {}
const Home: NextPageWithLayout<Props> = (props) => {
  return (
    <>
      <HTMLMetaTags />

      <h1>Main content</h1>
    </>
  )
}

// Home.getLayout = (page) => page

export default Home
