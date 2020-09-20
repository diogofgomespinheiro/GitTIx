import { merge } from 'lodash';
import { config as devConfig } from './dev';
import { config as testingConfig } from './testing';
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  cookieSession: {},
  dbUrl: '',
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  jwtKey: '',
  natsClientId: '',
  natsClusterId: '',
  natsUrl: '',
  port: process.env.PORT || 5001,
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = devConfig;
    break;
  case 'test':
  case 'testing':
    envConfig = testingConfig;
    break;
  default:
    envConfig = devConfig;
}

export default merge(baseConfig, envConfig);
