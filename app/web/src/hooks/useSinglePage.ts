import { useCallback, useState } from "react";

type Options = {
  start?: number;
  max?: number;
};

export const useSinglePage = ({ start = 0, max = 10 }: Options) => {
  const [page, _setPage] = useState(start);

  const nextPage = useCallback(() => {
    _setPage((prev) => (prev >= max ? max : prev + 1));
  }, [max]);

  const prevPage = useCallback(() => {
    _setPage((prev) => (prev <= start ? start : prev - 1));
  }, [start]);

  const resetPage = useCallback(() => {
    _setPage(() => start);
  }, [start]);

  const setPage = useCallback(
    (page: number) => {
      if (page <= start) {
        _setPage(() => start);
        return;
      }
      if (page >= max) {
        _setPage(() => max);
        return;
      }

      _setPage(() => page);
    },
    [start, max],
  );

  return {
    page,
    setPage,
    nextPage,
    prevPage,
    resetPage,
  };
};
