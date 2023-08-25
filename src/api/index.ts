import { baseUrl } from "../constants/envConstants";
import { store } from "../main";

import axios, { AxiosError, AxiosInstance } from "axios";
import gamesApi from "./routes/games";

class Api {
  protected baseUrl: string;
  private _token: string | undefined;
  private instance: AxiosInstance;
  public games: any;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });

    this.instance.interceptors.request.use(async (config) => {
      // if (this._token) {
      //   const isExpared = checkExtToken(this._token);

      //   if (isExpared) {
      //     this.token = undefined;
      //     const refresh = getRefreshToken();
      //     if (refresh) {
      //       try {
      //         const { data } = await this.login.refreshToken({ refresh });
      //         setAccesToken(data.access);
      //         this.token = data.access;
      //       } catch (error) {
      //         this.token = undefined;
      //       }
      //     }
      //   }

      //   config.headers = {
      //     ...config.headers,
      //     Authorization: `Bearer ${this._token}`,
      //   };
      // }
      return config;
    });

    this.instance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // store.dispatch(logout());
        }
        throw error;
      }
    );

    this.games = gamesApi(this.instance);
  }

  get token() {
    return this._token;
  }

  set token(newToken) {
    this._token = newToken;
  }
}

const api = new Api(baseUrl);

export default api;
