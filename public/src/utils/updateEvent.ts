import axios from 'axios';

export const updateEvent = async (event) => {
  try {
    const response = await axios.patch(
      'http://127.0.0.1:5001/events/' + event._id,
      event,
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
