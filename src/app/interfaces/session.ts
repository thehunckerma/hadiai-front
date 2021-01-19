export interface Session {
  '@UUID': string;
  id: number;
  createdDate: string;
  lastModifiedDate: string;
  end: boolean;
  students: any[];
}
