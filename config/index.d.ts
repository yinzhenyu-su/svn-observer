import GlobalConfig from './global.default'
import RepoConfigs from './repos.default';

export interface BaseConfig {
  global: GlobalConfig;
  repos: RepoConfigs;
}

export type Config<T=object> = BaseConfig & T;

type PromiseConfig = Promise<Config>;

export default PromiseConfig;