type Props = {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginationBar({ hasPrev, hasNext, onPrev, onNext }: Props) {
  if (!hasPrev && !hasNext) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer flex items-center gap-1.5"
      >
        &larr; Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer flex items-center gap-1.5"
      >
        Next &rarr;
      </button>
    </div>
  );
}
