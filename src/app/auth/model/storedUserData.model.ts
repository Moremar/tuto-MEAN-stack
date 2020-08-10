import { User } from './user.model';

// User data stored in local storage for auto-login
export class StoredUserData {
    constructor(
        public user: User,
        public token: string,
        public expiresIn: number
    ) {}
  }
  