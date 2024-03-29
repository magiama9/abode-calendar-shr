import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './interface/event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}

  // Creates an event
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventModel(createEventDto);
    return await newEvent.save();
  }

  // Finds all events
  async findAll(): Promise<Array<Event>> {
    const allEvents = await this.eventModel.find().exec();
    return allEvents;
  }

  // Finds all events which a given user email is either the creator or an invitee
  async findAllByEmail(userEmail, dateRange): Promise<Array<Event>> {
    const allEventsByUser = await this.eventModel
      .find({
        $and: [
          {
            start: { $gte: dateRange.startOfRange, $lt: dateRange.endOfRange },
          },
          { $or: [{ createdBy: userEmail }, { invitees: userEmail }] },
        ],
      })
      .exec();
    return allEventsByUser;
  }

  // Finds a given event by eventId
  async findOne(eventId: number): Promise<Event> {
    const event = await this.eventModel.findById(eventId).exec();
    return event;
  }

  // Updates a given event by eventId
  async updateEvent(
    eventId: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      updateEventDto,
      { new: true },
    );
    return updatedEvent;
  }

  // Deletes a given event by eventId
  async removeEvent(eventId: number): Promise<any> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(eventId);
    return deletedEvent;
  }
}
