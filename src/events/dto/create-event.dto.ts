export class CreateEventDto {
  eventId: number;
  title: string;
  description: string;
  //   date: Date;
  invitees: Array<string>;
}
