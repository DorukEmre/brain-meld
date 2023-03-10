// import { useSession, signIn, signOut } from 'next-auth/react'

import HTMLMetaTags from '@/components/HTMLMetaTags'
import Explorer from '@/components/Explorer'

const Home = () => {
  // const { data: session } = useSession()

  return (
    <>
      <HTMLMetaTags />
      {/* {session ? <Explorer /> : <p>Not signed in</p>} */}
      <Explorer />
    </>
  )
}

export default Home
