import mongoose from "mongoose";

const connetDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}blog`
      // `mongodb://127.0.0.1:27017/blogtest`
    );
    console.log(
      `Connected to mongodb DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongdb connection error", error);
    process.exit(1);
  }
};
export default connetDb;
