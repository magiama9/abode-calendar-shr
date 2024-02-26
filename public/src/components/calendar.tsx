import { FC, useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
  const [events, setEvents] = useState<Event[]>([
    {
      eventId: 1,
      title: 'Learn cool stuff',
      start,
      end,
    },
  ]);

  const InitialRangeChangeToolbar = (props) => {
    useEffect(() => {
      props.onView(props.view);
    }, []);
    return <Toolbar {...props} />;
  };

  // Handles adding new event to the calendar
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt('New Event Name');
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }]);
      }
    },
    [setEvents],
  );

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
      if (e.eventId !== event.eventId) {
        return e;
      } else {
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
      if (e.eventId !== event.eventId) {
        return e;
      } else {
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
    <DnDCalendar
      components={{ toolbar: InitialRangeChangeToolbar }}
      defaultView="week"
      events={events}
      localizer={localizer}
      onSelectSlot={handleSelectSlot}
      onView={onView}
      view={view}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      selectable
      resizable
      style={{ height: '90vh' }}
    />
  );
};

export default Cal;
