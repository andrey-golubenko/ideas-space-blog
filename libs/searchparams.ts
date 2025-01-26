import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server'

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  authProvider: parseAsString,
  categories: parseAsString,
  published: parseAsString,
  author: parseAsString
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
