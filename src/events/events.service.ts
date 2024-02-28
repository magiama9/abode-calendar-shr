import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './interface/event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
// import { ObjectId } from 'mongodb';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}

  // Creates an event
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventModel(createEventDto);
    console.log(newEvent);
    return await newEvent.save();
  }

  async findAll(userEmail): Promise<Array<Event>> {
    const allEventsByUser = await this.eventModel
      .find({ invitees: userEmail })
      .exec();
    console.log(allEventsByUser);
    return allEventsByUser;
  }
  // Finds all events that are associated with a given user
  // async findAllByUser(userId: number): Promise<Array<Event>> {
  //   const allEventsByUser = await this.eventModel.findAllByUser(userId).exec();
  //   return allEventsByUser;
  // }

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
