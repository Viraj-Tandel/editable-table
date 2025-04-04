export interface User {
    name: string;
    language: string;
    id: string;
    bio: string;
    version: number;
    isEditable: boolean;
    [key: string]: any;
}
  