export class EnvKeysChecker {
  static readonly keysToCheck = [
    'JWT_KEY',
    'NATS_CLIENT_ID',
    'NATS_CLUSTER_ID',
    'NATS_URL',
  ];

  static checkKeys() {
    this.keysToCheck.forEach(checkSingleKey);
  }
}

const checkSingleKey = (key: string) => {
  if (!process.env[key]) {
    throw new Error(`${key} not defined`);
  }
};
