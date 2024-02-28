import { Document } from 'mongoose';

export interface Event extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  createdBy: string;
  // date: Date;
  invitees: Array<string>;
}
