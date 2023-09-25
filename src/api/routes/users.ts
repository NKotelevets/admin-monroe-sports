import { AxiosInstance, AxiosPromise } from "axios";

import {
  FinishResetPasswordRequestParamsI,
  FinishResetPasswordResponseDataI,
  CheckEmailRequestParamsI,
  CheckEmailResponseDataI,
  LoginRequestParamsI,
  LoginResponseDataI,
  RefreshTokenRequestParamsI,
  RefreshTokenResponseDataI,
  StartResetPasswordRequestParamsI,
  StartResetPasswordResponseDataI,
  RegisterRequestParamsI,
  RegisterResponseDataI,
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
      url: `${this.url}/login/refresh-token/`,
      data,
      method: "POST",
    });
  }

  userCheckEmail(
    params: CheckEmailRequestParamsI
  ): AxiosPromise<CheckEmailResponseDataI> {
    return this.request({
      url: `${this.url}/check-email`,
      params,
      method: "GET",
    });
  }

  userRegister(
    data: RegisterRequestParamsI
  ): AxiosPromise<RegisterResponseDataI> {
    return this.request({
      url: `${this.url}/register`,
      data,
      method: "POST",
    });
  }

  userStartResetPassword(
    data: StartResetPasswordRequestParamsI
  ): AxiosPromise<StartResetPasswordResponseDataI> {
    return this.request({
      url: `${this.url}/start-reset-password`,
      data,
      method: "POST",
    });
  }

  userFinishResetPassword(
    data: FinishResetPasswordRequestParamsI
  ): AxiosPromise<FinishResetPasswordResponseDataI> {
    return this.request({
      url: `${this.url}/finish-reset-password`,
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
