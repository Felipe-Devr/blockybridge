import { User } from 'djs/structures';
import { BaseCache } from './base';

class MembersCache extends BaseCache<string, User> {}

export { MembersCache };
