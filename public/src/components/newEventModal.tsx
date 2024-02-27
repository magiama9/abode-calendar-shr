import * as React from 'react';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import {
  Typography,
  Modal,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from '@mui/material';
import {
  LocalizationProvider,
  DateField,
  TimeField,
  DatePicker,
  DateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// import Modal from '@mui/material/Modal';

import { EventFormData } from './calendar';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const formStyle = {
  width: 200,
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
  onAddEvent
}: IProps) => {
  const { description, title, invitees, start, end } = eventFormData;
  //   const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  const onClose = () => handleClose();
  const onSave = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log();
  };

  //   const [modalEvent, setModalEvent] = React.useState({
  //     title: props.event.title,
  //     description: '',
  //     invitees: '',
  //   });

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
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
                defaultValue={title}
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                // onChange={onChange}
              />
              {/* <DateField
                name="startDate"
                value={start}
                margin="dense"
                id="startDate"
                label="startDate"
                fullWidth
                variant="outlined"
              /> */}
              <TimeField
                name="startTime"
                value={start}
                margin="dense"
                id="startTime"
                label="Start Time"
                fullWidth
                variant="outlined"
              />
              <TimeField
                name="endTime"
                value={end}
                margin="dense"
                id="endTime"
                label="End Time"
                fullWidth
                variant="outlined"
              />
              <DatePicker
                sx={formStyle}
                name="startDate"
                value={start}
                label="Start Date"
                // variant="outlined"
              />
              <DatePicker
                sx={formStyle}
                name="endDate"
                value={end}
                label="End Date"
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
            <Button variant="contained" onClick={onSave}>
              Save Event
            </Button>
            <Button color="error">Delete Event</Button>
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
