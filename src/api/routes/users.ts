import { AxiosInstance, AxiosPromise } from "axios";

import {
  LoginRequestParamsI,
  LoginResponseDataI,
  RefreshTokenRequestParamsI,
  RefreshTokenResponseDataI,
} from "../../interfaces";

import CRUD from "../base";

export class UsersApi extends CRUD {
  userLogin(data: LoginRequestParamsI): AxiosPromise<LoginResponseDataI> {
    return this.request({
      url: `${this.url}/login/`,
      data,
      method: "POST",
    });
  }

  userRefreshToken(
    data: RefreshTokenRequestParamsI
  ): AxiosPromise<RefreshTokenResponseDataI> {
    return this.request({
      url: `${this.url}/login/refresh-token`,
      data,
      method: "POST",
    });
  }
}

export default function usersApi(request: AxiosInstance) {
  return new UsersApi({
    url: "/users",
    request,
  });
}
