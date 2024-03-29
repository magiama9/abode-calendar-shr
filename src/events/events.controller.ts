import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ValidateObjectId } from 'src/shared/validate-object-id.pipes';
import Agenda from 'agenda';
import main from 'src/notifications/nodeMailer'; // Note to self: rename this function
import { sub, isPast } from 'date-fns';
import dotenv from 'dotenv';

// Theoretically process.env should already be loaded globally, but it doesn't seem to have loaded by the time this is being used, so instantiating it again here fixes issues
dotenv.config();
// ** CONTAINS NOTIFICATION LOGIC **
// ** THIS SHOULD BE SEPARATED INTO A SEPARATE MODULE **

const dbURL = process.env.DATABASE_URL;
const agenda = new Agenda({
  db: { address: dbURL },
  name: 'Events Queue',
});

// Creates a new agenda job every time it's called
agenda.define('Add Notification', async (job) => {
  if (job.attrs.data) {
    const notificationList = [].concat(
      job.attrs.data.invitees,
      job.attrs.data.createdBy,
    );
    const eventObject = { ...job.attrs.data, invitees: notificationList };
    main(eventObject);
  }
});
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Finds the user's events
  @Get('user/:userEmail')
  async findAll(
    @Res() res,
    @Param('userEmail') userEmail: string,
    @Query('startOfRange') startOfRange: Date,
    @Query('endOfRange') endOfRange: Date,
  ) {
    const events = await this.eventsService.findAllByEmail(userEmail, {
      startOfRange: startOfRange,
      endOfRange: endOfRange,
    });
    await agenda.start();
    return res.status(HttpStatus.OK).json(events);
  }

  // Creates New Event
  @Post()
  async createEvent(@Res() res, @Body() createEventDto: CreateEventDto) {
    const newEvent = await this.eventsService.createEvent(createEventDto);
    if (!newEvent) {
      throw new NotFoundException('Event was not created.');
    } else {
      // Get the time 30 minutes before the event
      // If that time is before now, we don't send a notification
      // Without this, if you schedule an agenda job for a time before now, it runs on instantiation

      // Also this functionality is duplicated elsewhere - should extract into function
      const notificationTime = sub(newEvent.start, { minutes: 30 });

      if (!isPast(notificationTime)) {
        await agenda.schedule(notificationTime, 'Add Notification', newEvent);
      }
      return res.status(HttpStatus.OK).json({
        message: 'Event has been created successfully.',
        event: newEvent,
      });
    }
  }

  // Fetches a single event
  @Get(':eventId')
  async findOne(@Res() res, @Param('eventId', new ValidateObjectId()) eventId) {
    const event = await this.eventsService.findOne(eventId);
    if (!event) {
      throw new NotFoundException('Event does not exist.');
    }
    return res.status(HttpStatus.OK).json(event);
  }

  // Updates a single event
  @Patch(':eventId')
  async updateEvent(
    @Res() res,
    @Param('eventId', new ValidateObjectId()) eventId,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(
      eventId,
      updateEventDto,
    );
    if (!updatedEvent) {
      throw new NotFoundException('Event does not exist');
    } else {
      // Delete old job and create new job
      // As far as I know, agenda doesn't provide a native method to update jobs
      // Another option would be to store the agenda job id on the event, and then search the job db for that
      const agendaDelete = await agenda.cancel({
        'data._id': updatedEvent._id,
      });

      const notificationTime = sub(updatedEvent.start, { minutes: 30 });
      if (!isPast(notificationTime)) {
        await agenda.schedule(
          notificationTime,
          'Add Notification',
          updatedEvent,
        );
      }
    }
    return res.status(HttpStatus.OK).json({
      message: 'Event has been successfully updated.',
      event: updatedEvent,
    });
  }

  // Deletes a single event
  @Delete(':eventId')
  async removeEvent(
    @Res() res,
    @Param('eventId', new ValidateObjectId()) eventId,
  ) {
    const deletedEvent = await this.eventsService.removeEvent(eventId);
    if (!deletedEvent) {
      throw new NotFoundException('Event does not exist.');
    } else {
      // Deletes the agenda job for the given event id
      const agendaDelete = await agenda.cancel({
        'data._id': deletedEvent._id,
      });
      return res.status(HttpStatus.OK).json({
        message: 'Event has been deleted.',
        event: deletedEvent,
      });
    }
  }
}
