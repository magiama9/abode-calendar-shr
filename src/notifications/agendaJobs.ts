import Agenda from 'agenda';

const agenda = new Agenda({
  db: { address: 'mongodb://127.0.0.1:27017/abode-calendar-shr' },
  name: 'Notification Queue',
});

agenda.define('welcome message', () => {
  console.log('Agenda is running');
});

export default async function agendaJobs() {
  await agenda.start();
  await agenda.every('5 minutes =', 'welcome message');
}
