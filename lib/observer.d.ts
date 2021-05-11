import { AxiosInstance } from 'axios';
import { BaseConfig, Config } from '../config/index';

interface SetData {
  (BaseConfig: BaseConfig) : void;
}

export default interface Observer {
  private readonly _intervalHandle: number;
  private readonly _isWorking: boolean;
  private readonly _axios: null | AxiosInstance;
  private readonly _maxErrorCount: number;
  start: () => void;
  stop: () => void;
  main: () => void;
  notifyRepo:() => void;
  isWorking: () => boolean;
  getData: () => BaseConfig;
  setData: SetData;
}
