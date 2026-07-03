import mongoose from "mongoose"
import dns from "dns"

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

const connectDB = async () => { 
    try {
        
        await mongoose.connect(process.env.MONGO_URL!)
        console.log("MongoDB connected successfully")

    } catch (error) {
        console.log(error,"MongoDb connection failed")
        process.exit(1)
    }
}

export default connectDB 