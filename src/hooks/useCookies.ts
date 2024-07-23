import { useCookies as useReactCookie } from 'react-cookie'

type TCookieName = 'accessToken' | 'refreshToken'

const MONTH_MILLISECONDS = 2592000

const COOKIE_SETTINGS = {
  domain: 'localhost', // TODO: update when will be available new env
  path: '/',
  secure: true,
  maxAge: MONTH_MILLISECONDS,
}

const COOKIES_LIST: TCookieName[] = ['accessToken', 'refreshToken']

export const useCookies = () => {
  const [cookies, setCookie, removeCookie] = useReactCookie(COOKIES_LIST)

  const createCookie = (cookieName: TCookieName, value: string) => setCookie(cookieName, value, COOKIE_SETTINGS)

  const deleteCookie = (cookieName: TCookieName) => removeCookie(cookieName, COOKIE_SETTINGS)

  return {
    cookies,
    createCookie,
    deleteCookie,
  }
}

