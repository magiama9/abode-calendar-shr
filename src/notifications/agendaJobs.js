import Agenda from 'agenda';

const agenda = new Agenda({
  db: { address: 'mongodb://127.0.0.1:27017/abode-calendar-shr' },
});

agenda.define('welcome message', () => {
  console.log('This is running on agenda');
});

await agenda.start();

await agenda.every('5 seconds =', 'welcome message');
