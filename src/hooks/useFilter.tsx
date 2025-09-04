import { useMemo } from "react";

type FilterParams<T> = {
  searchTerm?: string;
  searchFields?: (keyof T)[];
  filters?: Partial<Record<keyof T, string>>;
};

export function useFilter<T>(data: T[], params: FilterParams<T>) {
  const { searchTerm = "", searchFields = [], filters = {} } = params;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchFields.some((field) => {
        const value = String(item[field] ?? "").toLowerCase();
        return value.includes(searchTerm.toLowerCase().trim());
      });

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        return value === "" || String(item[key as keyof T]) === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, searchFields, filters]);

  return filteredData;
}
