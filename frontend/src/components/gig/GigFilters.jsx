export default function GigFilters({ filters, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <select
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="border border-black px-3 py-2 bg-white text-black"
      >
        <option value="">All Categories</option>
        <option value="Web Dev">Web Dev</option>
        <option value="Design">Design</option>
        <option value="Writing">Writing</option>
        <option value="Marketing">Marketing</option>
        <option value="Data">Data</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ difficulty: e.target.value })}
        className="border border-black px-3 py-2 bg-white text-black"
      >
        <option value="">All Levels</option>
        <option value="Basic">Basic</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value })}
        className="border border-black px-3 py-2 bg-white text-black"
      >
        <option value="">Newest</option>
        <option value="budgetAsc">Budget: Low to High</option>
        <option value="budgetDesc">Budget: High to Low</option>
        <option value="deadlineAsc">Deadline: Soonest</option>
      </select>
    </div>
  );
}
