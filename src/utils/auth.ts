import { lsApi } from "./localStorageApi";

interface AuthTokenI {
  refresh: string;
  access: string;
}

export const getToken = (): string | null => {
  const _accessToken = lsApi.get<string>("accessToken");
  return _accessToken || null;
};

export const getRefreshToken = (): string | null => {
  const _accessToken = lsApi.get<string>("refreshToken");
  return _accessToken || null;
};

export const setTokens = (data: AuthTokenI): void => {
  lsApi.set("accessToken", data.access);
  lsApi.set("refreshToken", data.refresh);
};

export const setAccesToken = (token: string): void => {
  lsApi.set("accessToken", token);
};

export const deleteToken = (): void => {
  lsApi.clear();
};
