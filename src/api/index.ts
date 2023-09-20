import { baseUrl } from "../constants/envConstants";
import { store } from "../main";

import axios, { AxiosError, AxiosInstance } from "axios";
import gamesApi from "./routes/games";
import usersApi, { UsersApi } from "./routes/users";
import { deleteToken, getRefreshToken, setAccesToken } from "../utils/auth";

class Api {
  protected baseUrl: string;
  private _token: string | undefined;
  private instance: AxiosInstance;
  public games: any;
  public users: UsersApi;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      },
    });

    // this.instance.interceptors.request.use(async (config) => {
    //   console.log(this);
    //   if (this._token) {
    //     // TODO: condition for check is token expared ??
    //     //const isExpared = checkExtToken(this._token);

    //     if (false) {
    //       this.token = undefined;
    //       const refresh = getRefreshToken();
    //       if (refresh) {
    //         try {
    //           const { data } = await this.users.userRefreshToken({
    //             token: refresh,
    //           });
    //           setAccesToken(data.access);
    //           this.token = data.access;
    //         } catch (error) {
    //           this.token = undefined;
    //         }
    //       }
    //     }

    //     config.headers = {
    //       ...config.headers,
    //       Authorization: `Bearer ${this._token}`,
    //     };
    //   }
    //   return config;
    // });

    this.instance.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.token = undefined;
          const refresh = getRefreshToken();
          if (refresh) {
            try {
              const { data } = await this.users.userRefreshToken({
                token: refresh,
              });
              setAccesToken(data.access);
              this.token = data.access;
            } catch (error) {
              this.token = undefined;
            }
          } else {
            deleteToken();
            //store.dispatch(logout());
          }
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this._token}`,
          };
        }
      }
    );

    this.games = gamesApi(this.instance);
    this.users = usersApi(this.instance);
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
