export interface Delivery {
  id: number;
  username: string;
  status: 'working' | 'off';
  lat: number;
  lng: number;
}
