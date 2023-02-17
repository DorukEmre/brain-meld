import { Configuration, OpenAIApi } from 'openai'

const getOpenAI = async (_: unknown, { prompt }: { prompt: string }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  try {
    const result = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0,
      max_tokens: 70,
    })
    return result.data.choices[0].text
  } catch (error) {
    console.error(error)
    return error.response.data.error.message
  }
}

export default getOpenAI
