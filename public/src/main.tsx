import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  routerProvider,
} from 'react-router-dom';
import App from './App.tsx';
import LandingPage from './components/landingPage.tsx';
import ErrorPage from './components/errorPage.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/calendar/:userEmail',
    element: <App />

  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>,
);
