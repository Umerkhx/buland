interface DesignCategory {
  id: number;
  name: string;
}

interface FilterBarProps {
  designCategories: DesignCategory[];
  selectedDesignCategory: string | null;
  onFilterChange: (categoryId: string | null) => void;
}

export default function FilterBar({
  designCategories,
  selectedDesignCategory,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="font-semibold mb-3">Filter by Design Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-4 py-2 rounded-lg transition ${
            !selectedDesignCategory
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {designCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange(cat.id.toString())}
            className={`px-4 py-2 rounded-lg transition ${
              selectedDesignCategory === cat.id.toString()
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}