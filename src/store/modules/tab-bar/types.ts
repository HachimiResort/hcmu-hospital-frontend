export interface TagProps {
  title: string;
  name: string;
  fullPath: string;
  query?: any;
  params?: Record<string, unknown>;
  ignoreCache?: boolean;
}

export interface TabBarState {
  tagList: TagProps[];
  cacheTabList: Set<string>;
}
