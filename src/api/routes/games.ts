import { AxiosInstance, AxiosPromise } from "axios";
import CRUD from "../base";

export class GamesApi extends CRUD {
  getGamesList(): AxiosPromise<any[]> {
    return this.request({
      url: `${this.url}/`,
    });
  }
}

export default function gamesApi(request: AxiosInstance) {
  return new GamesApi({
    url: "/games",
    request,
  });
}
