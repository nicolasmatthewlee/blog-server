import { Model, model, Schema, Types } from "mongoose";

interface articleI {
  title: string;
  textBrief: string;
  author: string;
  authorId?: any;
  created: Date;
  image: Buffer;
  imageAlt: string;
  content: { type: string; text: string }[];
}

const articleSchema = new Schema({
  title: { type: String, required: true },
  textBrief: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: Types.ObjectId, required: false },
  created: { type: Date, required: true },
  image: { type: Buffer, required: true },
  imageAlt: { type: String, required: true },
  content: {
    type: [
      {
        type: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    required: true,
  },
});

const Article: Model<articleI> = model("article", articleSchema);

export { Article, articleI };
