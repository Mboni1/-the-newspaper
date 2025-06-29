const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;