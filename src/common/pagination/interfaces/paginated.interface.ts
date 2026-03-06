export interface Paginated<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    current: string;
    next: string | null;
    previous: string | null;
    last: string;
  };
}
