import mongoose from "mongoose";    

const connect = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Error connecting to Database:", error.message);
        process.exit(1); // Exit the process with failure
    }
}

export default connect;