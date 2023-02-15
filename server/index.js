const express = require('express')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
// const schema = require('./schema/schema')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const app = express()

// Connect to DB
connectDB()

// graphQL end point '/graphql'
// graphqlHTTP require schema
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     // graphiql true if in dev mode to use GraphiQL tool to manually issue GraphQL queries
//     graphiql: process.env.NODE_ENV === 'development',
//   }),
// )

app.listen(port, () => console.log(`Server running  http://localhost:${port}`))
