import { useState } from "react";
import SearchPro from "./SearchPro";
import ProCard from './ProCard';

const ProsList = ({ pros }) => {
  const [search, setSearch] = useState('');

  const prosToDisplay = pros.filter(pro => pro.name.toLowerCase().includes(search.toLowerCase()) || pro.service.toLowerCase().includes(search.toLowerCase()) || pro.area_served.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app">
      <p>{prosToDisplay.length} pros based on your criteria.<br />
      Narrow down your search by name, specialty or area.</p>
      <SearchPro onChangeText={e => setSearch(e.target.value)} search={search} />
      <ul className="cards">
        {prosToDisplay.map(pro => 
        <ProCard key={pro.id} pro={pro} />)}
      </ul>
    </div>
  )
}

export default ProsList


