import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  invitees: Array<string>,
});
