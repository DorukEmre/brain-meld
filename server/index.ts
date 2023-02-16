import express from 'express'
const app = express()

import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'

import connectDB from './config/db.js'
import { schema } from './schema/schema.js'

const port = process.env.PORT || 5000

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema, graphiql: true })
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Connect to DB then start the server
connectDB().then(() => {
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`)
  })
})
