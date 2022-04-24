export interface ListItem {
  key: string;
  value: string;
}

export interface PagedFilter {
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  total: number;
  items: T[];
}

export interface PaginatorData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}