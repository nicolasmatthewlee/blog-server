import { model, Model, Schema, Types } from "mongoose";

interface userI {
  username: string;
  password: string;
  saved: any[];
  liked: any[];
  notifications: any[];
}

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  saved: { type: [Types.ObjectId], required: true },
  liked: { type: [Types.ObjectId], required: true },
  notifications: {
    type: [Types.ObjectId],
    required: true,
  },
});

const User: Model<userI> = model("user", userSchema);

export { User, userI };
