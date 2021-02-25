import { User } from './user';

export interface Section {
  '@UUID': string;
  id: number;
  name: string;
  description: string;
  token: string;
  sessionOn: boolean;
  students: Array<User>;
  requests?: Array<User>;
  sessions?: any[];
  teacher?: User;
  createdDate: string;
  lastModifiedDate: string;
}
export interface AddSection {
  name: string;
  description?: string;
}
