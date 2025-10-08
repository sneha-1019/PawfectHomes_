import { FaSearch } from 'react-icons/fa';

const FilterBar = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search pets..."
          name="search"
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <select name="species" value={filters.species} onChange={handleChange}>
        <option value="All">All Species</option>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Bird">Bird</option>
        <option value="Rabbit">Rabbit</option>
        <option value="Other">Other</option>
      </select>

      <select name="gender" value={filters.gender} onChange={handleChange}>
        <option value="All">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select name="size" value={filters.size} onChange={handleChange}>
        <option value="All">All Sizes</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>

      <select name="sort" value={filters.sort} onChange={handleChange}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name (A-Z)</option>
        <option value="popular">Most Popular</option>
      </select>

      <button className="btn-primary" onClick={onSearch}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;
