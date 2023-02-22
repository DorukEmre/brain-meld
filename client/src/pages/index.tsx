import type { NextPageWithLayout } from '@/pages/_app'
import HTMLMetaTags from '@/components/HTMLMetaTags'
import Main from '@/components/Main'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <HTMLMetaTags />
      <Main />
    </>
  )
}

// Home.getLayout = (page) => page

export default Home
