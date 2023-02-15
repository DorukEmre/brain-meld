import Head from 'next/head'

const HTMLMetaTags = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta name="description" content={description} />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <title>{title}</title>
    </Head>
  )
}

HTMLMetaTags.defaultProps = {
  title: 'Brain Meld',
  description: 'Organise and manage outputs obtained from chat AIs',
}

export default HTMLMetaTags
