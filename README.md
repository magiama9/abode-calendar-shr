# Welcome to Abode Calendar

This is a simple proof-of-concept app built for AbodeHR. The associated requirements document is here in the repo. At its core, this is a simple CRUD calendar app with user notifications. In this README you will find the basic design principles, an overview of the technologies used, and a roadmap for improvement.

![Demo Calendar Image](https://github.com/magiama9/abode-calendar-shr/blob/master/documents/abode-calendar-shr-demo-styled.png)
![Demo Modal Image](https://github.com/magiama9/abode-calendar-shr/blob/master/documents/abode-calendar-shr-demo-styled-modal.png)

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

The calendar only loads events that are in view. When the view range changes, a new call is made to the server and the new events that start within that view are loaded in. This should result in a performance increase when a user has a large number of events on their calendar.

The front end is written in React, and uses [react-big-calendar](https://github.com/jquense/react-big-calendar) as the base for the calendar functionality.

Note: currently the modal/form implementation is wonky and I recognize that. The parent component (which is the calendar) is re-rendering every time the form data changes, which is ...less than ideal. You'll note that especially with a large number of events on the calendar, the site bogs down when editing the form.

## Back End

The back end is running on Node/Nest. The database (as you've already seen) is MongoDB which contains a collection for event data as well as job data for the notification system.

The API is set up to very basically handle requests. There's currently no authentication and very little validation/sanitization on routes, so have fun manipulating requests to do weird things and break it.

## Notifications

Notifications are sent as dummy emails using [nodemailer](https://nodemailer.com/). [Agenda](https://github.com/agenda/agenda) is used to schedule jobs that run a nodemailer function. Currently the emails are sent using [Ethereal Email](https://ethereal.email/). You can log in to my dummy mailbox using the credentials in `/src/notifications/nodeMailer.ts` or you can generate a new Ethereal Email. Just don't forget to update the credentials.

Currently, jobs are scheduled to run 30 minutes before the meeting time is scheduled, as long as that time is some time in the future. If you create an event in the past, a job _shouldn't_ be scheduled to run. If you delete an event, the associated notification job is deleted as well. If you update an event, we first delete the old job and then create a new job for the updated time. There's no limit on how many jobs can be stored in the database, but I believe the default limit for Agenda is 20 concurrent (running concurrently, not scheduled) jobs if you want to try and break it.

# Design Choices

There are several areas where I made choices to speed up development and sacrifice things I would normally do on a production ready app.

The most glaring omission in my mind is authentication. Both the front end and the back end definitely need some sort of authorization system. As it is, you can view and edit any calendar you want just by changing the url or writing requests to the server.

As I mentioned in the front end section, there's also an issue with how I'm storing state on the form component which is causing unnecessary re-renders of the calendar component on form state change. This is something that can be easily fixed, but the core functionality is working currently, so I haven't fixed it yet. Another front end noticeable omission is decent responsiveness and accessibility. Those issues are easily fixable and don't detract from the core functionality currently.

Scalability of the architecture isn't terrible, but could definitely be improved. Currently, when a user views their events, the database is querying all events to find a match on a nested property within the collection. This is fast with a relatively small number of events, but can slow down considerably as the collection size increases. As an improvement, there should probably be a `user` collection that stores events or eventIds on it.

In terms of overall code quality, there's definitely improvement to be made on the typings. Types are currently very inconsistently applied, and are even sometimes conflicting(yay!). Any halfway decent build pipeline would chuck this thing right out the door. But right now it runs in dev, and that's what I care about.

Testing is also currently non-existent. Given more time, I would have liked to increase the testing coverage from 0% to at least 75%(hey, we can't be perfect, right?).

# Roadmap For Improvement

- Form improvements
    - Fix calendar component re-render on form changes _HIGH PRIORITY_
    - Change invitees from a comma separated list into an input with a button to add a new invitee
    - Style the form more consistently with the rest of the app (stop using MaterialUI components, probably) _LOW PRIORITY_

- Authentication & authorization _HIGH PRIORITY_
  - Authenticate users & allow true login functionality
  - Require authorization on back-end routes

- ~Load only events in view~ _FINISHED_

- Implement real-time updating of events _LOW PRIORITY_
    - If an event is created/updated/deleted on one calendar, it should instantly sync to everyone else's calendar without a page reload
    - As a simple implementation, perhaps just make a db call for the current view every x interval(maybe 1-2 minutes)
        - Since events are only loaded for the current view, there's relatively low overhead, but can still result in strange behavior and could stress db/server with a large number of concurrent users
    - Scalable implementation probably requires WebSockets

- Change event deletion behavior to better model real-life use case
  - If the creator of the event deletes it, delete it for everyone
    - And notify event participants (?)
  - If an invitee of the event deletes it, delete it only for them
    - And notify event participants (?)

- Change event update behavior (?)
  - Add button to discard changes on event(essentially duplicate functionality of clicking outside the modal, without actually closing the modal) (?)
  - If an event is modified, send a notification to all the other participants about the change and the new event (?)
  - Only allow event creator to edit the event (?)
  - Only allow event creator to remove invitees, but allow all participants to add invitees (?)

- Handle all-day event creation from week view/dropping events into the all-day section from day/week view

- Allow sub calendars for a user, e.g. work & school, and allow users to selectively display some or all of the calendars they have

- Change navigation so back/forward browser buttons work on view changing _LOW PRIORITY_

- Event styling (possible choices) _LOW PRIORITY_
  - Default to one color for events you've created and another color for events someone has invited you to
  - Allow custom colors for events or for event categories

- Calendar theming _LOW PRIORITY_
  - Allow users to change color scheme/theme of calendar

- Increase testing coverage
  - Unit & integration tests for basic CRUD functionality on the back end
  - E2E testing coverage for basic use cases

- Increase type coverage & uniformity
  - Increase consistency between typings on the front and back end
  - Increase type coverage, especially on the front end

- Clean up unused files, methods, and dependencies _LOW PRIORITY_
