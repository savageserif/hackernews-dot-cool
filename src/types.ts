export type HackerNewsCategory = 'top' | 'new' | 'best' | 'ask' | 'show';

export interface HackerNewsItemData {
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
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface HackerNewsItem extends Omit<HackerNewsItemData, 'url'> {
  url?: {
    hostname: string;
    pathname: string;
    href: string;
    search: string;
  };
}

export interface HackerNewsUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}
