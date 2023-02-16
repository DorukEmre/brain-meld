import { set, connect } from 'mongoose'

const connectDB = async () => {
  try {
    set('strictQuery', true)
    const conn = await connect(process.env.MONGO_URI)

    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(err)
  }
}

export default connectDB
