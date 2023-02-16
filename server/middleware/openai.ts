import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const getOutput = async (req) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: req.body.prompt,
    temperature: 0,
    max_tokens: 7,
  })

  return response.data
}

export default getOutput
