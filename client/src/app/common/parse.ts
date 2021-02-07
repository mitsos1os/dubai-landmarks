import * as parseInstance from 'parse';

import { environment } from '../../environments/environment';

const { applicationId, serverUrl } = environment;
console.log('Initializing Parse client...');
parseInstance.initialize(applicationId);
(parseInstance as any).serverURL = serverUrl;

export const Parse = parseInstance;
