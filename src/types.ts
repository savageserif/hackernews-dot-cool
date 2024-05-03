export interface HackerNewsItem {
  id: number;
  deleted?: boolean;
  type?: string;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: URL;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface HackerNewsUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}
