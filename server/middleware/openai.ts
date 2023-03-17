import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const getOpenAI = async (
  _: unknown,
  { input }: { input: ChatCompletionRequestMessage[] },
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  console.log(input)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: input,
    })

    console.log(completion.data.choices[0].message)
    return completion.data.choices[0].message
  } catch (error) {
    console.error(error)
    return error.response.data.error.message
  }
}

export default getOpenAI
