import type { RouteParamsRawGeneric } from 'vue-router';

export interface TagProps {
  title: string;
  name: string;
  fullPath: string;
  query?: any;
  params?: RouteParamsRawGeneric;
  ignoreCache?: boolean;
}

export interface TabBarState {
  tagList: TagProps[];
  cacheTabList: Set<string>;
}
