import { useMyList } from './useMyList';

export function useIsInList(mal_id: number) {
  const { data: entries } = useMyList();

  const entry = entries?.find((e) => e.mal_id === mal_id);

  return {
    isInList: !!entry,
    entry,
  };
}
