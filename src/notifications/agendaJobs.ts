import Agenda from 'agenda';
import dotenv from 'dotenv';

// dotenv.config();
const dbURL = process.env.DATABASE_URL;
const agenda = new Agenda({
  db: { address: dbURL },
  name: 'Notification Queue',
});

agenda.define('welcome message', () => {
  console.log(process.env.DATABASE_URL);
  console.log('Agenda is running');
});

export default async function agendaJobs() {
  await agenda.start();
  await agenda.every('5 minutes =', 'welcome message');
}
