import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const getOpenAI = async (
  _: unknown,
  { input }: { input: ChatCompletionRequestMessage[] },
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  // console.log(input)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: input,
    })
    // console.log(completion.data.choices[0].message)

    // Remove any whitespace and leading line breaks
    const reply = completion.data.choices[0].message
    reply.content = reply.content.replace(/^\s*[\r\n]{2}/, '')
    return reply
  } catch (error) {
    console.error(error)
    return error.response.data.error.message
  }
}

export default getOpenAI
