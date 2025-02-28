import { AccountRoutes } from '@/Routes/AccountRoutes.tsx'
import { ProtectedRoutes } from '@/Routes/ProtectedRoutes.tsx'
import { RedirectHandler } from '@/Routes/RedirectHandler.tsx'
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
    {/* Backwards compatibility with app deep linking */}
    <Route path="/create-new-password/:token" element={<RedirectHandler basePath="create-new-password" />} />
    <Route path="/invite-coach/:token" element={<RedirectHandler basePath="invite-coach" />} />
    <Route path="/invite-player/:token" element={<RedirectHandler basePath="invite-player" />} />
    <Route path="/invite-parent/:token" element={<RedirectHandler basePath="invite-parent" />} />
    <Route path="/child-parent/:token" element={<RedirectHandler basePath="child-parent" />} />
    <Route path="/invite-user/:token" element={<RedirectHandler basePath="invite-user" />} />

    <Route path="/invite-coach/:token/:accepted" element={<RedirectHandler basePath="invite-coach" />} />
    <Route path="/invite-player/:token/:accepted" element={<RedirectHandler basePath="invite-player" />} />
    <Route path="/invite-parent/:token/:accepted" element={<RedirectHandler basePath="invite-parent" />} />
    <Route path="/child-parent/:token/:accepted" element={<RedirectHandler basePath="child-parent" />} />

    <Route path="/sign-up/:token" element={<RedirectHandler basePath="sign-up" />} />
    <Route
      path="/create-password-child-invitation/:token"
      element={<RedirectHandler basePath="create-password-child-invitation" />}
    />

    <Route path="/accounts/*" element={<AccountRoutes />} />
    <Route path="*" element={<ProtectedRoutes />} />
  </Routes>
)

export default Root
