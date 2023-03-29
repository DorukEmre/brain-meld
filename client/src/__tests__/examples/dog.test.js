import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { Dog } from './dog'
import { GET_DOG_QUERY } from './dogQuery'
import { GraphQLError } from 'graphql'

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Buck',
      },
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      },
    },
  },
]

describe('Dog', () => {
  it('renders without error', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>,
    )
    // Test Loading state
    expect(await screen.findByText('Loading...')).toBeInTheDocument()

    // Test Success state
    expect(await screen.findByText('Buck is a bulldog')).toBeInTheDocument()
  })

  it('should show error UI (Network error)', async () => {
    const dogMock = {
      request: {
        query: GET_DOG_QUERY,
        variables: { name: 'Buck' },
      },
      error: new Error('Network error'),
    }

    render(
      <MockedProvider mocks={[dogMock]} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>,
    )

    // Test Network errors
    expect(await screen.findByText('Network error')).toBeInTheDocument()
  })

  it('should show error UI (GraphQL error)', async () => {
    const dogMock = {
      request: {
        query: GET_DOG_QUERY,
        variables: { name: 'Buck' },
      },
      result: {
        errors: [new GraphQLError('GraphQL error!')],
      },
    }

    render(
      <MockedProvider mocks={[dogMock]} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>,
    )

    // Test GraphQL errors
    expect(await screen.findByText('GraphQL error!')).toBeInTheDocument()
  })
})
