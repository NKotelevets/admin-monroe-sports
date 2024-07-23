import Root from '@/Root'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import store, { persistor } from '@/redux/store'

import DesignConfigProvider from '@/utils/DesignConfigProvider'

import './global.css'

const router = createBrowserRouter([
  {
    path: '*',
    element: <Root />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DesignConfigProvider>
          <RouterProvider router={router} />
        </DesignConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
