# Welcome to Abode Calendar

This is a simple proof-of-concept app built for AbodeHR. The associated requirements document is here in the repo. At its core, this is a simple CRUD calendar app with user notifications. In this README you will find the basic design principles, an overview of the technologies used, and a roadmap for improvement.

# Getting Started

First, clone the repo

```
git clone https://github.com/magiama9/abode-calendar-shr.git
```

Then install the dependencies. From root directory run

```
cd public && npm i
```

```
cd src && npm i
```

Next we need to make sure we have a mongoDB instance running. If you don't have a mongodb installed, you can install and run it with Brew (on MacOS). Otherwise you can download it from [MongoDB](https://www.mongodb.com/docs/manual/installation/).

```
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Create a .env file in the root directory of your project and add `DATABASE_URL = mongodb://127.0.0.1:27017/abode-calendar-shr`. Change the port to whatever your instance of mongodb is using (27017 is the default)

Now let's get up and running. From the root of the project, run `cd public && npm run dev` and in a new terminal run `cd src && npm run start -- -b swc`

In your browser, navigate to "http://localhost:5173" to view the running project.

# Functionality

## Front End

After "signing in" (enter anything you want, it's not even validated as an email address), users are shown their calendar with all events which they have either created or are an invitee for.

By selecting events, or clicking/dragging on the calendar, users are able to:

- Add Events
- View Event Details
- Delete Events
- Reschedule Events

The front end is written in React, and uses [react-big-calendar](https://github.com/jquense/react-big-calendar) as the base for the calendar functionality.

Note: currently the modal/form implementation is wonky and I recognize that. The parent component (which is the calendar) is re-rendering every time the form data changes, which is ...less than ideal. You'll note that especially with a large number of events on the calendar, the site bogs down when editing the form. I need to either convert to a global state store (redux or zustand) or write a custom state hook to prevent this.

## Back End

The back end is running on Node/Nest. The database (as you've already seen) is MongoDB which contains a collection for event data as well as job data for the notification system.

The API is set up to very basically handle requests. There's currently no authentication and very little validation/sanitization on routes, so have fun manipulating requests to do weird things and break it.

## Notifications

Notifications are sent as dummy emails using [nodemailer](https://nodemailer.com/). [Agenda](https://github.com/agenda/agenda) is used to schedule jobs that run a nodemailer function. Currently the emails are sent using [Ethereal Email](https://ethereal.email/). You can log in to my dummy mailbox using the credentials in `/src/notifications/nodeMailer.ts` or you can generate a new Ethereal Email. Just don't forget to update the credentials.

Currently, jobs are scheduled to run 30 minutes before the meeting time is scheduled, as long as that time is some time in the future. If you create an event in the past, a job _ shouldn't _ be scheduled to run. If you delete an event, the associated notification job is deleted as well. If you update an event, we first delete the old job and then create a new job for the updated time. There's no limit on how many jobs can be stored in the database, but I believe the default limit for Agenda is 20 concurrent (running concurrently, not scheduled) jobs if you want to try and break it.

## Design Choices

There are several areas where I made choices to speed up development and sacrifice things I would normally do on a production ready app.

The most glaring omission in my mind is authentication. Both the front end and the back end definitely need some sort of authorization system. As it is, you can view and edit any calendar you want just by changing the url or writing requests to the server.

As I mentioned in the front end section, there's also an issue with how I'm storing state on the form component which is causing unnecessary re-renders of the calendar component on form state change. This is something that can be easily fixed, but the core functionality is working currently, so I haven't fixed it yet. Another front end noticeable omission is decent responsiveness and accessibility (not to mention making it look a little less gnarly). Those issues are easily fixable and don't detract from the core functionality currently.

Scalability of the architecture isn't terrible, but could definitely be improved. Currently, when a user views their events, the database is querying all events to find a match on a nested property within the collection. This is fast with a relatively small number of events, but can slow down considerably as the collection size increases. As an improvement, there should probably be a `user` collection that stores events or eventIds on it.

Another notable improvement would be to only fetch events for the current view range of the calendar. Currently when a user logs in, it pulls all of their events. Instead, we should essentially lazy load only the events that would be in view at a particular time.

In terms of overall code quality, there's definitely improvement to be made on the typings. Types are currently very inconsistently applied, and are even sometimes conflicting(yay!). Any halfway decent build pipeline would chuck this thing right out the door. But right now it runs in dev, and that's what I care about.

Testing is also currently non-existent. Given more time, I would have liked to increase the testing coverage from 0% to at least 75%(hey, we can't be perfect, right?).