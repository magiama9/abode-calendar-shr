import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
  // Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ValidateObjectId } from 'src/shared/validate-object-id.pipes';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Finds the user's events
  @Get('user/:userEmail')
  async findAll(@Res() res, @Param('userEmail') userEmail: string) {
    const events = await this.eventsService.findAll(userEmail);
    return res.status(HttpStatus.OK).json(events);
  }

  // Creates New Event
  @Post()
  async createEvent(@Res() res, @Body() createEventDto: CreateEventDto) {
    const newEvent = await this.eventsService.createEvent(createEventDto);
    if (!newEvent) {
      throw new NotFoundException('Event was not created.');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Event has been created successfully.',
      event: newEvent,
    });
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
    }
    return res.status(HttpStatus.OK).json({
      message: 'Event has been deleted.',
      event: deletedEvent,
    });
  }
}
