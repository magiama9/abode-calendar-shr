import { isBefore, add } from 'date-fns';
import {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
} from 'react';
import { Typography, Modal, TextField, Button, Box } from '@mui/material';
import {
  LocalizationProvider,
  TimeField,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { EventFormData } from './calendar';
import { useCustomState } from '../utils/hooks/useCustomState';

// ** Styling **
// ** This is a wacky, non-responsive, terrible implementation, but it gets the job done for now

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#dbd4cf',
  border: '2px solid #0f4e32',
  boxShadow: 24,
  p: 4,
  font: 'Inter',
};

const formStyle = {
  width: 196,
  mr: 0.5,
  mt: 0.5,
};

interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  eventFormData: EventFormData;
  setEventFormData: Dispatch<SetStateAction<EventFormData>>;
}
const NewEventModal = ({
  open,
  handleClose,
  eventFormData,
  setEventFormData,
  onAddEvent,
  onDeleteEvent,
}: IProps) => {
  const { description, title, invitees, start, end } = eventFormData;

  const initialEventFormState: EventFormData = {
    title: '',
    description: '',
    eventId: undefined,
    start: undefined,
    end: undefined,
    invitees: [],
  };

  const [workingFormData, setWorkingFormData] = useState(eventFormData);
  const [currentEvent, setCurrentEvent] = useState(eventFormData);

  // useContext(TestFormData);

  // const initialFormState = useRef(eventFormData);
  // Closes Modal
  const onClose = () => handleClose();

  // ** CHANGE HANDLERS **
  // ** CONSIDER REWRITING SO RERENDERS AREN'T HAPPENING ON VALUE CHANGE **

  // Change Handler for form input changing
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // ** TODO: CHANGE THIS **
  // I should change this so that each invitee is mapped into a new textfield element
  // with a button to add another invitee and a button to remove each invitee.
  // This is inelegant and easily breakable, but it works for now.

  // Handles Invitee Change
  const onInviteeChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Essentially disables leading or trailing whitespace(and also the spacebar, essentially) in the event form
    // Whitespace is trimmed because "   test@test.com" is a different user than "test@test.com" otherwise
    // Probably more elegant to strip the whitespace on the db save, but this works for now and makes my life easy
    const newInviteeArray = event.target.value.split(',');
    const trimmedInvitees = newInviteeArray.map((invitee) => {
      return invitee.trim();
    });
    setEventFormData((prevState) => ({
      ...prevState,
      invitees: trimmedInvitees,
    }));
  };

  // ** TODO: Make this work **
  // const renderInviteeForms = () => {
  //   eventFormData.invitees.forEach((invitee) => {
  //     return (
  //       <div>
  //         <TextField value={invitee}/>
  //       </div>
  //     );
  //   });
  // };

  // Change Handlers for Time/Date Changing
  // These probably shouldn't have to be different, but this works

  // Handle Start Time Change
  const onStartTimeChange = (time: Date) => {
    // If start time is before end time, store start time
    // Otherwise we push the end time back 30 minutes from start time
    if (isBefore(time, end)) {
      setEventFormData((prevState) => ({
        ...prevState,
        start: time,
      }));
    } else {
      // const duration = intervalToDuration({ start: time, end: end });
      const duration = { minutes: 30 };
      const endTime = add(time, duration);
      setEventFormData((prevState) => ({
        ...prevState,
        start: time,
        end: endTime,
      }));
    }
  };

  // Handle End Time Change
  const onEndTimeChange = (time: Date) => {
    // If end time is before start time, push start time to 30 minutes before end time
    // Otherwise we store end time
    // Has some wacky behavior if you type the end date vs. using the picker
    // Core functionality of ensuring end time is after start time works fine though
    if (isBefore(time, start)) {
      const duration = { minutes: -30 };
      const startTime = add(time, duration);
      setEventFormData((prevState) => ({
        ...prevState,
        start: startTime,
        end: time,
      }));
    } else
      setEventFormData((prevState) => ({
        ...prevState,
        end: time,
      }));
  };

  // const onSave = (e: MouseEvent<HTMLButtonElement>) => {
  //   console.log(workingFormData);
  //   setEventFormData(workingFormData);
  //   console.log(eventFormData);
  //   onAddEvent(e);
  // };

  // Was seeing if there's an event emitted/action to take when the modal transition fires (there doesn't seem to be)
  const enterTest = (e) => {
    console.log(e);
    console.log('test');
  };
  return (
    <div>
      <Modal
        open={open}
        // onTransitionEnter={}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {' Create Event '}
          </Typography>
          <Box component="form">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TextField
                name="title"
                value={title}
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                onChange={onChange}
              />
              <TextField
                name="description"
                value={description}
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                minRows={4}
                maxRows={10}
                variant="outlined"
                onChange={onChange}
              />
              <TextField
                name="invitees"
                value={invitees}
                margin="dense"
                id="invitees"
                label="Invitees - Separate by comma"
                type="text"
                fullWidth
                multiline
                minRows={1}
                maxRows={10}
                variant="outlined"
                onChange={onInviteeChange}
              />
              {/* {eventFormData.invitees.map((invitee, i) => {
                return (
                  <TextField
                    name="invitee"
                    value={invitee}
                    margin="dense"
                    id="invitees"
                    label="Invitee"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={onChange}
                  />
                );
              })} */}

              <TimeField
                name="startTime"
                sx={formStyle}
                value={start}
                margin="dense"
                id="startTime"
                label="Start Time"
                variant="outlined"
                onChange={onStartTimeChange}
              />
              <TimeField
                name="endTime"
                sx={formStyle}
                value={end}
                margin="dense"
                id="endTime"
                label="End Time"
                variant="outlined"
                onChange={onEndTimeChange}
              />
              <DatePicker
                sx={formStyle}
                name="startDate"
                value={start}
                label="Start Date"
                onChange={onStartTimeChange}
                // variant="outlined"
              />
              <DatePicker
                sx={formStyle}
                name="endDate"
                value={end}
                label="End Date"
                onChange={onEndTimeChange}
                // variant="outlined"
              />
              {/* <DateTimePicker
                sx={formStyle}
                name="startDateAndTime"
                value={start}
                views={['year', 'day', 'hours', 'minutes', 'seconds']}
                // margin="dense"
                // id="startDateAndTime"
                label="Start Day and Time"
                fullWidth
                variant="outlined"
              /> */}
              <p></p>
            </LocalizationProvider>
            <Button
              sx={{ bgcolor: '#0f4e32' }}
              variant="contained"
              onClick={onAddEvent}
            >
              Save Event
            </Button>
            <Button sx={{ color: '#f06424' }} onClick={onDeleteEvent}>
              Delete Event
            </Button>
          </Box>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </div>
  );
};
export default NewEventModal;
