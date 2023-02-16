import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { graphqlHTTP } from 'express-graphql'

import { buildSchema } from 'graphql'
import { Configuration, OpenAIApi } from 'openai'

import pkg from 'body-parser'
const { json } = pkg
import cors from 'cors'
// const schema = require('./schema/schema')
import connectDB from './config/db.js'
const port = process.env.PORT || 5000

// const getOutput = require('./middleware/openai')

const app = express()

app.use(json())
app.use(cors())

// Connect to DB
connectDB()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Define the GraphQL schema
const schema = buildSchema(`
  type Query {
    generateText(text: String!): String
  }
`)

// app.get('/openai', async (req, res) => {
//   try {
//     const output = await getOutput(req)

//     res.send({ output: output.choices[0].text })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({ error: error.message })
//   }
// })

// Define the root resolver
const root = {
  generateText: async ({ text }) => {
    try {
      const result = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: text,
        temperature: 0,
        max_tokens: 70,
      })
      return result.data.choices[0].text
    } catch (error) {
      console.error(error)
      return null
    }
  },
}

// Configure the GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
)

app.listen(port, () => console.log(`Server running  http://localhost:${port}`))
