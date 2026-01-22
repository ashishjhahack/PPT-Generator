import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'
import Workspace from './workspace/index.tsx';
import { UserDetailContext } from '../context/UserDetailContext.tsx';
import Outline from './workspace/project/outline/index.tsx';


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/workspace", element: <Workspace />,
    children: [
      { path: "project/:projectId/outline", element: <Outline /> }
    ]
  },
])

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


function Root() {
  const [userDetail, setUserDetail] = useState();      // using context to share user detail across the app
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>    
        <RouterProvider router={router} />
      </UserDetailContext.Provider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
