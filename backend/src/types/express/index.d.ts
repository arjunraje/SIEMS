import { User } from '../../entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: 'Admin' | 'Accountant' | 'Client';
      };
    }
  }
}
