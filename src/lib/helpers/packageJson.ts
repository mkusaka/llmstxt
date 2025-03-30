import { name, version, description } from '../../../package.json';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

const packageInfo: PackageInfo = { name, version, description };

export default packageInfo;