const express = require('express')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const bodyParser = require('body-parser')
const cors = require('cors')
// const schema = require('./schema/schema')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const getOutput = require('./middleware/openai')

const app = express()

app.use(bodyParser.json())
app.use(cors())

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

app.post('/message', (req, res) => {
  const output = getOutput(req)

  output
    .then((data) => {
      res.send({ output: data.choices[0].text })
    })
    .catch((err) => {
      console.log(err)
      res.send('error')
    })
})

app.listen(port, () => console.log(`Server running  http://localhost:${port}`))
