export class CreateEventDto {
  eventId: number;
  title: string;
  description: string;
  createdBy: string;
  //   date: Date;
  invitees: Array<string>;
}
