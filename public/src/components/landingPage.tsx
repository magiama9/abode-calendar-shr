import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import './index.css';

const LandingPage: FC = () => {
  const navigate = useNavigate();
  const useHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userEmail = data.get('email');

    const calendarUrl = '/calendar/' + userEmail;
    navigate(calendarUrl);
  };
  return (
    <Container component="main" maxWidth="xs" sx={{ bgcolor: '#f3ece6' }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          View your calendar
        </Typography>
        <Box
          component="form"
          onSubmit={useHandleSubmit}
          noValidate
          sx={{ mt: 1, border: '#0f4e32' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{ '&input:focus-visible': { backgroundColor: '#F06424' } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#0f4e32',
              mt: 3,
              mb: 2,
              '&:hover': { backgroundColor: '#F06424' },
            }}
          >
            Let's Go
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
