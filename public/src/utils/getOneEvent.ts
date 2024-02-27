import axios from 'axios';
export const getOneEvent = async (eventId) => {
  try {
    const response = await axios.get('http://127.0.0.1:5001/events/' + eventId);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
