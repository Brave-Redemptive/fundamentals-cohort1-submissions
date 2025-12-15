import mongoose, { Schema } from "mongoose"


const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("activity", activitySchema);
