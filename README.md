# Brain Meld

## Description

Brain Meld is a full-stack application that allows users to communicate with ChatGPT and save the responses in a user-friendly folder structure resembling a file explorer.
It makes it easier to manage and organise the answers into various categories.

The app uses React/Next.js, Node.js, GraphQL and MongoDB to interact with the OpenAI API.

![Example conversation in the app](Example-1.jpg)

## Installation

1. Clone the repository: `git clone https://github.com/DorukEmre/brain-meld.git`
2. Change into the directory: `cd brain-meld`
3. Install server dependencies: `npm install`
4. Install client dependencies: `npm install --prefix client`
5. Add environment variable file `.env` to root folder
6. Set `MONGO_URI` to the URI of the MongoDB instance you want to connect to.
7. Set `OPENAI_API_KEY` to your [OpenAI API key](https://platform.openai.com/account/api-keys)

## Usage

### Starting the Server

1. Run the server with the following command: `npm run server`
2. The server will start on http://localhost:5000

### Starting the Client

1. Start the client with the following command: `npm run client`
2. The client will start on http://localhost:3000

## Development

### TypeScript

1. Start the TypeScript compiler in watch mode with the following command: `npm run watch`
2. TypeScript errors will be displayed in the console

### Testing

1. Run tests with the following command: `npm run test`
2. The test results will be displayed in the console

### Linting

1. Run the linter with the following command: `npm run lint`
2. Linter errors and warnings will be displayed in the console

## Tools

### Frontend:

React/Next.js,
TypeScript,
Apollo client

### Backend:

GraphQL API,
OpenAI REST API,
Node.js, graphql-yoga
Mongoose

### Database:

MongoDB
