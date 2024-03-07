import {
  FC,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import { useParams } from 'react-router-dom';
import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import NewEventModal from './newEventModal';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { add, endOfWeek } from 'date-fns';
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';

import axios from 'axios';

import { createEvent } from '../utils/createEvent';
import { updateEvent } from '../utils/updateEvent';
import { getAllEvents } from '../utils/getAllEvents';
import { deleteEvent } from '../utils/deleteEvent';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

export interface EventFormData {
  title: string;
  description: string;
  start?: Date;
  end?: Date;
  eventId?: string;
  createdBy?: string;
  invitees?: Array<string>;
}

export interface IEventInfo extends Event {
  _id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  eventId?: string;
  createdBy?: string;
  invitees?: Array<string>;
}

const Cal: FC = () => {
  // Fetches path to grab user email address
  // Or whatever unvalidated junk they pass to the url I guess
  const path = useParams();

  const locales = {
    'en-US': enUS,
  };
  const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
  const now = new Date();
  const start = endOfHour(now);
  const end = addHours(start, 2);
  // The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const DnDCalendar = withDragAndDrop(Calendar);
  const [view, setView] = useState(Views.WEEK);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    eventId: 1,
    title: 'Default',
    start,
    end,
  });

  const [date, setDate] = useState(new Date()); // Used for controlling the view of the calendar
  const [scrollToTime, setScrollToTime] = useState(new Date()); // Used for controlling the initial time displayed on the calendar
  const [isNew, setIsNew] = useState(false); // For managing if event is new or updating current event
  const [openSlot, setOpenSlot] = useState(false); // For managing modal state

  //   For managing event state
  const [events, setEvents] = useState([
    {
      eventId: '65dba47ad6d0d4a0ac0d31b1',
      title: 'Learn cool stuff',
      description: 'Learning Cool Stuff',
      start,
      end,
      invitees: [
        'samrandels@gmail.com',
        'james@abodehr.com',
        'tedlasso@richmondafc.com',
      ],
    },
  ]);

  const initialEventFormState: EventFormData = {
    title: '',
    description: '',
    eventId: undefined,
    start: undefined,
    end: undefined,
    createdBy: path.userEmail,
    invitees: [],
  };

  //   For managing form state
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState,
  );

  const [dateRange, setDateRange] = useState<Array<Date>>([
    startOfWeek(now),
    endOfWeek(now),
  ]);

  // const TestFormData = createContext('test');
  // const test = useContext(TestFormData);

  // Fires on first component mount, and then again whenever dateRange changes
  // Fetches all events from the db where the start of the event is within dateRange and userEmail matches
  useEffect(() => {
    const promisedEvents = getAllEvents(path.userEmail, dateRange);
    // Server returns start and end times as strings, they're converted into date objects to work with react-big-calendar
    promisedEvents.then((results) => {
      const dbEvents = results?.data.map((result: IEventInfo) => ({
        title: result.title,
        description: result.description,
        start: new Date(result.start),
        end: new Date(result.end),
        invitees: result.invitees,
        _id: result._id,
      }));

      setEvents(dbEvents);
    });
  }, [dateRange]);

  //   Resets Event Form State and closes modal
  const handleClose = () => {
    setEventFormData(initialEventFormState);
    setCurrentEvent(initialEventFormState);
    setOpenSlot(false);
  };

  //   Generating an object id as a placeholder before database connection is established
  const objectId = () => {
    function hex(value) {
      return Math.floor(value).toString(16);
    }
    return (
      hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
    );
  };

  //   Handles deleting event
  const onDeleteEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Checks if current event already exists
    // e.g. should we delete the stored event on delete or simply close the modal without saving
    if (currentEvent._id) {
      const deletedEvent = deleteEvent(currentEvent._id);

      deletedEvent.then((response: Promise<object>) => {
        const newEvents = events.filter((event) => {
          return event._id !== response?.data.event._id;
        });
        setEvents(newEvents);
      });
      handleClose();
    } else {
      handleClose();
    }
  };

  //  This should get us the initial view on render
  //  Currently unnecessary but also not breaking anything, so...
  const InitialRangeChangeToolbar = (props) => {
    useEffect(() => {
      props.onView(props.view);
    }, []);
    return <Toolbar {...props} />;
  };

  //   Handles selecting event
  const handleSelectEvent = (event: IEventInfo) => {
    setOpenSlot(true);

    // We should probably fetch the event info from the database here rather than relying on state in case someone else edited the event
    // getOneEvent(event.eventId);
    setEventFormData(event);
    setCurrentEvent(event);
  };

  // Handles adding new event to the calendar
  const addNewEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // If there's an event id, it's an update action
    // Otherwise it's a new event
    // Also there has to be a better way to build these objects
    // Also also my types are both questionable and conflicting
    if (currentEvent._id) {
      const updatedEvent = updateEvent(eventFormData);
      updatedEvent.then((result) => {
        const newEvents = events.map((event) => {
          if (event._id !== result?.data.event._id) {
            return event;
          } else {
            const newEvent = {
              title: result?.data.event.title,
              description: result?.data.event.description,
              start: new Date(result?.data.event.start),
              end: new Date(result?.data.event.end),
              createdBy: result?.data.event.createdBy,
              invitees: result?.data.event.invitees,
              _id: result?.data.event._id,
            };
            return newEvent;
          }
        });
        setEvents(newEvents);
      });
    } else {
      const createdEvent = createEvent(eventFormData);
      createdEvent.then((result) => {
        // restructuring object as new event so we can convert dates from strings to date objects for react-big-calendar to not freak out
        const newEvent = {
          title: result?.data.event.title,
          description: result?.data.event.description,
          start: new Date(result?.data.event.start),
          end: new Date(result?.data.event.end),
          invitees: result?.data.event.invitees,
          createdBy: result?.data.event.createdBy,
          _id: result?.data.event._id,
        };
        setEvents((prev) => [...prev, newEvent]);
      });
    }

    handleClose();
  };

  //   Functionality for clicking on the calendar or dragging to create a new event
  const handleSelectSlot = ({ start, end }) => {
    setEventFormData((prevState) => ({
      ...prevState,
      start: start,
      end: end,
    }));
    setScrollToTime(start);
    setDate(start);
    setOpenSlot(true);
  };

  // Update View State
  // Resolves issue with view resetting on component rerender & event creation/updating
  const onView = useCallback((newView) => setView(newView), [setView]);

  // ** CONSIDER REFACTORING - REPETITIVE CODE **

  // Handles Event Resize
  const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
    const { event, start, end } = data;

    // Creates new array of events and updates event with matching eventId
    const newEvents = events.map((e) => {
      if (e._id !== event._id) {
        return e;
      } else {
        updateEvent({ ...e, start: new Date(start), end: new Date(end) });
        return {
          ...e,
          start: new Date(start),
          end: new Date(end),
        };
      }
    });

    //
    setEvents(newEvents);
  };

  // Handles Event Dragging
  const onEventDrop: withDragAndDropProps['onEventDrop'] = (data) => {
    const { event, start, end } = data;
    const newEvents = events.map((e) => {
      if (e._id !== event._id) {
        return e;
      } else {
        updateEvent({ ...e, start: new Date(start), end: new Date(end) });
        return {
          ...e,
          start: new Date(start),
          end: new Date(end),
        };
      }
    });
    setEvents(newEvents);
  };

  // Sets the current date range when we navigate so that calendar doesn't reset to default date on creating/updating/deleting events
  // Resets the scrollToTime (earliest time displayed on the calendar) to 9 AM.
  const onNavigate = useCallback(
    (newDate) => {
      setDate(newDate);
      setScrollToTime(new Date().setHours(9));
    },
    [setDate],
  );

  // Gets the current range of start and end for the in view events and stores that range in state
  // If the current view is Month or Agenda, react-big-calendar returns an object with a start and end property
  // If the current view is Day or Week, react-big-calendar returns an array with length 1(Day) or length 7(Week)
  // We should be able to access the current view from state, but it hasn't updated by the time this fires, so instead we have some weird logic
  const onRangeChange = useCallback(
    (newRange) => {
      if (Array.isArray(newRange)) {
        if (newRange.length == 1) {
          setDateRange([
            newRange[0],
            add(newRange[0], { hours: 23, minutes: 59, seconds: 59 }),
            // When the range is a single day, rbc only returns the start of the day. This uses date-fns to create a new date object for the end of the day
          ]);
        } else {
          // For some unknown reason, when you change to the week view, rbc returns the end of the week as the start of the day, not the end of the day
          // This makes sure that when you change from week view (where dateRange is calculated properly on calendar load) to another view and then back, you don't lose Saturday events
          setDateRange([
            newRange[0],
            add(newRange[6], { hours: 23, minutes: 59, seconds: 59 }),
          ]);
        }
      } else {
        setDateRange([newRange.start, newRange.end]);
      }
    },
    [setDateRange],
  );

  return (
    <div>
      {/* <TestFormData.Provider value="test"> */}
      <DnDCalendar
        // components={{ toolbar: InitialRangeChangeToolbar }}
        defaultView="week"
        defaultDate={date}
        onNavigate={onNavigate}
        scrollToTime={scrollToTime}
        events={events}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onRangeChange={onRangeChange}
        onView={onView}
        view={view}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        selectable
        resizable
        style={{ height: '99vh' }} // at 100 vh you can slightly scroll the top bar out of view
      />
      <NewEventModal
        open={openSlot}
        handleClose={handleClose}
        eventFormData={eventFormData}
        setEventFormData={setEventFormData}
        onAddEvent={addNewEvent}
        onDeleteEvent={onDeleteEvent}
      />
      {/* </TestFormData.Provider> */}
    </div>
  );
};

export default Cal;
