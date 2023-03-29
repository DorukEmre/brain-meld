import { useQuery } from '@apollo/client'
import { GET_DOG_QUERY } from './dogQuery'

export function Dog({ name }) {
  const { loading, error, data } = useQuery(GET_DOG_QUERY, {
    variables: { name },
  })
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  )
}
