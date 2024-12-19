import { User } from '../structures/user';
import { BaseCache } from './base';

class UserCache extends BaseCache<string, User> {}

export { UserCache };
