import { Section } from './section';

export interface User {
  '@UUID'?: string;
  id: number;
  username: string;
  image: string;
  email: string;
  roles: string;
  studentSections?: Array<Section>;
  requests?: Array<Section>;
  teacherSections?: Array<Section>;
  createdDate?: string;
  lastModifiedDate?: string;
}
