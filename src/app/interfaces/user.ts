import { Section } from './section';

export interface User {
  '@UUID'?: string;
  id: number;
  username: string;
  email: string;
  roles: Role[];
  studentSections?: Array<Section>;
  requests?: Array<Section>;
  teacherSections?: Array<Section>;
  createdDate?: string;
  lastModifiedDate?: string;
}

interface Role {
  id: number;
  name: string;
}
