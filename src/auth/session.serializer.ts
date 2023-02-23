import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }

  deserializeUser(
    payload: User,
    done: (err: Error, payload: User) => void,
  ): any {
    done(null, payload);
  }
}
