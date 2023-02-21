import { model, Model, Schema } from "mongoose";

interface imageI {
  filename: string;
  contentType: string;
  data: Buffer;
}

const imageSchema = new Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
});

const Image: Model<imageI> = model("image", imageSchema);

export { Image, imageI };
