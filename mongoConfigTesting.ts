import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import { MongoMemoryServer } from "mongodb-memory-server";

const initializeMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  await mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });

  return { connection: mongoose.connection, uri: mongoUri };
};

module.exports = initializeMongoServer;
