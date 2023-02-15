import { useRouter } from 'next/router'
import Link from 'next/link'
import HTMLMetaTags from '@/components/HTMLMetaTags'

export default function PageNotFound() {
  const router = useRouter()

  const goBack = () => {
    if (window.history.state) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <HTMLMetaTags title="Page not found | Brain Meld" />

      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <br />
      <div className="">
        <p>
          <Link href="/" replace>
            Visit Our Homepage
          </Link>
          <span> or </span>
          <button className="" onClick={goBack}>
            Go back
          </button>
        </p>
      </div>
    </>
  )
}
