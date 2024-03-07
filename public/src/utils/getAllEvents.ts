import axios from 'axios';
export const getAllEvents = async (
  userEmail: string,
  dateRange: Array<Date>,
) => {
  const params = { startOfRange: dateRange[0], endOfRange: dateRange[1] };
  try {
    const response = await axios.get(
      'http://127.0.0.1:5001/events/user/' + userEmail,
      { params: params },
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
