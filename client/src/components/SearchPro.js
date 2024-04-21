const SearchPro = ({ search, onChangeText }) => {
  return (
    <div className="app">
      <div className="searchbar">
        <label htmlFor="search">HIRE A PRO</label>
        <input
          type="text"
          id="search"
          placeholder="Describe a service, project, pro, or area."
          value={search}
          onChange={onChangeText}
        />
      </div>
    </div>
  )
}

export default SearchPro