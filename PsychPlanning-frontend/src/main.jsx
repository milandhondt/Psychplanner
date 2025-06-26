import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home/Home.jsx';
import Layout from './pages/Layout.jsx';
import NotFound from './pages/NotFound.jsx';
import AfspraakPlannen from './pages/Afspraak plannen/AfspraakPlannen.jsx';
import Afspraken from './components/Afspraken/Afspraken.jsx';
import NieuweAfspraak from './components/Afspraken/NieuweAfspraak.jsx';
import LogIn from './pages/Log in/LogIn.jsx';
import Beschikbaarheden from './components/Mijn profiel/Beschikbaarheden.jsx';
import MijnServices from './components/Mijn profiel/MijnServices.jsx';
import { AuthProvider } from './contexts/Auth.context.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import MijnProfiel from './pages/Mijn profiel/MijnProfiel.jsx';
import LogOut from './pages/Log out/LogOut.jsx';
import Register from './pages/Register/Register.jsx';
import WijzigGegevensPage from './pages/Wijzig gegevens/WijzigGegevensPage.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate replate to='/home' />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/mijn-profiel',
        element:
          <PrivateRoute >
            <MijnProfiel />
          </PrivateRoute>,
        children: [
          {
            path: 'wijzig-gegevens',
            element: <WijzigGegevensPage />,
          },
          {
            path: 'beschikbaarheden',
            element: <Beschikbaarheden />,
          },
          {
            path: 'mijn-services',
            element: <MijnServices />,
          },
        ],
      },
      {
        path: '/afspraak-plannen',
        element:
          <PrivateRoute>
            <AfspraakPlannen />
          </PrivateRoute>,
        children: [
          {
            path: 'afspraken',
            element: <Afspraken />,
          },
          {
            path: 'nieuwe-afspraak',
            element: <NieuweAfspraak />,
          },
        ],
      },
      {
        path: '/login',
        element: <LogIn />,
      },
      {
        path: '/logout',
        element: <LogOut />,
      },
      {
        path: '/registreer',
        element: <Register />,
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChakraProvider>
        <RouterProvider router={router}>
        </RouterProvider>
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>,
);