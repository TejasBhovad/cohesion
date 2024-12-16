import { ComponentProps } from 'react';
import { useSetPage } from '../hooks/usePage';
import { cn } from '../utils';

export const HomePage = ({ data }) => {
  const setPage = useSetPage();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-white">
      {JSON.stringify(data)}
    </div>
  );
};
