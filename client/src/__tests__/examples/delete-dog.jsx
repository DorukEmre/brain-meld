import { useMutation } from '@apollo/client'
import { DELETE_DOG_MUTATION } from './dogMutation'

export function DeleteButton() {
  const [mutate, { loading, error, data }] = useMutation(DELETE_DOG_MUTATION)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>
  if (data) return <p>Deleted!</p>

  return (
    <button onClick={() => mutate({ variables: { name: 'Buck' } })}>
      Click to Delete Buck
    </button>
  )
}
