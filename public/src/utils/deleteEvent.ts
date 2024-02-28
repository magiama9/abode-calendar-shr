import axios from 'axios';
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      'http://127.0.0.1:5001/events/' + eventId,
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
