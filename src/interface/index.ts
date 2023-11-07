export interface ResponseAPI {
  photos: {
      photo: Result[];
  };
}

export interface Result {
  id: string | null;
  owner: string | null;
  secret: string | null;
  server: string | null;
  farm: string | null;
  title: string | null;
  ispublic: string | null;
  isfriend: string | null;
  isfamily: string | null;
}
