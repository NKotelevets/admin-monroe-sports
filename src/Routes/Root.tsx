import { AccountRoutes } from '@/Routes/AccountRoutes.tsx'
import { ProtectedRoutes } from '@/Routes/ProtectedRoutes.tsx'
import { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

/**
 * Root component that defines the main routing structure of the application.
 * It utilizes React Router's `Routes` component to specify route configurations.
 *
 * This component includes:
 * - `/accounts/*`: Routes associated with account-related actions, rendered by `AccountRoutes`.
 * - `*`: A fallback route for all other URLs, rendered by `ProtectedRoutes`.
 *
 * @function
 * @returns {ReactElement} The routing configuration for the app.
 */
const Root = (): ReactElement => (
  <Routes>
    <Route path="/accounts/*" element={<AccountRoutes />} />
    <Route path="*" element={<ProtectedRoutes />} />
  </Routes>
)

export default Root
