import { useEffect, useState } from "react";
import SearchPro from "./SearchPro";
import ProCard from './ProCard';

const ProsList = () => {
  const [pros, setPros] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch("/pros")
      .then(resp => resp.json())
      .then(pros => setPros(pros))
  }, [])

  // const addPro = pro => {
  //   setPros([...pros, pro])
  // }

  const updatePro = updatedProObj => {
    const updatedPros = pros.map(pro => {
      if (pro.id === updatedProObj.id) {
        return updatedProObj
      } else {
        return pro
      }
    })
    setPros(updatedPros)
  }

  const deletePro = id => {
    const updatedPros = pros.filter(pro => pro.id !== id)
    setPros(updatedPros)
  }

  const prosToDisplay = pros.filter(pro => pro.name.toLowerCase().includes(search.toLowerCase()) || pro.service.toLowerCase().includes(search.toLowerCase()) || pro.area_served.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app">
      <p>{prosToDisplay.length} pros based on your criteria.<br />
      Narrow down your search by name, specialty or area.</p>
      <SearchPro onChangeText={e => setSearch(e.target.value)} search={search} />
      <ul className="cards">
        {prosToDisplay.map(pro => 
        <ProCard key={pro.id} pro={pro} deletePro={deletePro} updatePro={updatePro} />)}
      </ul>
    </div>
  )
}

export default ProsList


