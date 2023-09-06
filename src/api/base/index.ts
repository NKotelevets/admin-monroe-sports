import { AxiosInstance } from "axios";

interface ConfigI {
  request: AxiosInstance;
  url: string;
}
class CRUD {
  protected url;
  protected request;
  constructor(config: ConfigI) {
    this.url = config.url;
    this.request = config.request;
  }
}

export default CRUD;
