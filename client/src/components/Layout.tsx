import { ReactNode } from 'react'
import Header from '@/components/Header'
import HTMLMetaTags from '@/components/HTMLMetaTags'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <HTMLMetaTags />
      {/* <Header /> */}
      <main className="wrapper">{children}</main>
    </>
  )
}
