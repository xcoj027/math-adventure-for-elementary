import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import MathAdventureGame from './MathAdventureGame.tsx';

const router = createBrowserRouter([
  { path: "/", Component: MathAdventureGame, index: true },
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />,

);
