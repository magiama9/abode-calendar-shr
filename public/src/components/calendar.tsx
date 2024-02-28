import { FC, useState, useEffect, useCallback, Fragment } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
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
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';

import axios from 'axios';

import { createEvent } from '../utils/createEvent';
import { updateEvent } from '../utils/updateEvent';
import { getAllEvents } from '../utils/getAllEvents';
import { getOneEvent } from '../utils/getOneEvent';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { create } from 'domain';

import CreateEventModal from './createEventModal';
import { set } from 'date-fns';

export interface EventFormData {
  title: string;
  description: string;
  start?: Date;
  end?: Date;
  eventId?: string;
  invitees: Array<string>;
}

export interface IEventInfo extends Event {
  _id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  eventId: string;
  invitees: Array<string>;
}

const promisedEvents = getAllEvents();

const Cal: FC = () => {
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
  const [open, setOpen] = useState(false);
  const [openSlot, setOpenSlot] = useState(false);
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
    invitees: [],
  };

  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState,
  );

  //   This logic should be in utils, but isn't resolving promise properly in useEffect()
  //   const getAllEvents = async () => {
  //     try {
  //       const response = await axios.get('http://127.0.0.1:5001/events/');
  //       //   setEvents(prevState);
  //       console.log(response);
  //       return response;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  // Fires only (twice) on first component mount because of empty dependency array
  // Basically functions as the hook version of componentDidMount()
  useEffect(() => {
    // Server returns start and end times as strings, they're converted into date objects to work with react-big-calendar
    promisedEvents.then((results) => {
      setEvents(
        results.data.map((result) => ({
          title: result.title,
          description: result.description,
          start: new Date(result.start),
          end: new Date(result.end),
          invitees: result.invitees,
          _id: result._id,
        })),
      );

      console.log(events);
    });
  }, []);
  const getAllCalenderEvents = () => {
    const dbEvents = getAllEvents();
    console.log(dbEvents);
    // setEvents(dbEvents);
  };
  //   Resets Event Form State and closes modal
  const handleClose = () => {
    // console.log(eventFormData);
    setEventFormData(initialEventFormState);
    setOpenSlot(false);
  };

  //   Generating an object id as a placeholder before database connection is established
  const objectId = () => {
    return (
      hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
    );
  };

  function hex(value) {
    return Math.floor(value).toString(16);
  }

  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: IEventInfo = {
      ...eventFormData,
      _id: objectId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
    };

    const newEvents = [...events, data];

    setEvents(newEvents);
    handleClose();
  };

  //   This should get us the initial view on render
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
    // getOneEvent(event.eventId);
    setEventFormData(event);
    setCurrentEvent(event);
  };
  //   const handleSelectEvent = useCallback((event: Event) => {
  //     setOpenSlot(true);
  //     getOneEvent(event.eventId);

  //     setEventFormData(event);

  //     // window.alert(event.title);
  //     setCurrentEvent(event);
  //   }, []);

  const addNewEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(eventFormData);
    // const data = {
    //   ...eventFormData,
    //   _id: objectId(),
    //   start: currentEvent?.start,
    //   end: currentEvent?.end,
    // };
    console.log(currentEvent);
    // const newEvent = {
    //   title: eventFormData.title,
    //   start: event.start,
    //   end: data.end,
    //   invitees: data.invitees,
    // };
    setEvents((prev) => [...prev, eventFormData]);
    createEvent(eventFormData);
    handleClose();
  };
  // Handles adding new event to the calendar

  //   Functionality for clicking on the calendar or dragging to create a new event
  const handleSelectSlot = ({ start, end }) => {
    setEventFormData((prevState) => ({
      ...prevState,
      start: start,
      end: end,
    }));
    setOpenSlot(true);
  };

  // Update View State
  // Resolves issue with view resetting on component rerender & event creation/updating
  const onView = useCallback((newView) => setView(newView), [setView]);

  // ** CONSIDER REFACTORING - REPETITIVE CODE **

  // Handles Event Resize
  const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
    console.log(data);
    console.log(events);
    console.log(Views);
    const { event, start, end } = data;

    // Creates new array of events and updates event with matching eventId
    const newEvents = events.map((e) => {
      if (e._id !== event._id) {
        return e;
      } else {
        console.log(e._id);
        console.log(e);
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
  // setEvents((currentEvents) => {
  //   const newEvent = {
  //     title: event.title,
  //     start: new Date(start),
  //     end: new Date(end),
  //   };
  //   console.log(newEvent);
  //   return [...currentEvents, newEvent];
  // });
  // };

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

  return (
    <div>
      <DnDCalendar
        components={{ toolbar: InitialRangeChangeToolbar }}
        defaultView="week"
        events={events}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onView={onView}
        view={view}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        selectable
        resizable
        style={{ height: '100vh' }}
      />
      <NewEventModal
        open={openSlot}
        handleClose={handleClose}
        eventFormData={eventFormData}
        setEventFormData={setEventFormData}
        onAddEvent={addNewEvent}
      />
    </div>
  );
};

export default Cal;
