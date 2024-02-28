import { Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import { EventsModule, EventsService } from '../events/events.module';
import { Model } from 'mongoose';
import { Event } from '../events/interface/event.interface';

const agenda = new Agenda({
  db: { address: 'mongodb://127.0.0.1:27017/abode-calendar-shr' },
  name: 'Notification Queue',
});

const getAllEvents = async () => {};
agenda.define('dataImport', async () => {
  // const whatEvenAmI = await EventsService.findAll();
  // console.log(whatEvenAmI);
  // console.log('running import');
  // const { runTime, invitees } = job.attrs.data;
  // getAllEvents();
  // console.log('Running import');
});

agenda.define('Send Email', async (job) => {});
agenda.define('welcome message', () => {
  console.log('This is running on agenda');
});

export default async function agendaJobs() {
  await agenda.start();
  await agenda.every('5 seconds =', 'welcome message');
  await agenda.every('10 seconds =', 'dataImport');
}
