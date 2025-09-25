import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './screens/root-layout.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
  },
]);
