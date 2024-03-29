import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
  createdBy: String,
  invitees: Array<string>,
});
