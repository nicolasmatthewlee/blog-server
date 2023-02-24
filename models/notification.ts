import { model, Model, Schema, Types } from "mongoose";

interface notificationI {
  user: any;
  event: string;
  time: Date;
  resource?: any;
}

const notificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "user", required: true },
  event: { type: String, required: true },
  time: { type: Date, required: true },
  resource: { type: Types.ObjectId, ref: "article", required: false },
});

const Notification: Model<notificationI> = model(
  "notification",
  notificationSchema
);

export { Notification, notificationI };
