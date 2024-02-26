import { Document } from 'mongoose';

export interface Event extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  // date: Date;
  invitees: Array<string>;
}
