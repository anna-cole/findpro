import { useState } from "react";
import { Link } from "react-router-dom";
import EditPro from "./EditPro";

const ProCard = ({ pro, currentUser, deletePro, updatePro }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (currentUser.username === pro.name) {
      fetch(`/pros/${pro.id}`, {method: "DELETE"})
      deletePro(pro.id)
    } 
  }

  const onUpdatePro = updatedPro => {
    if (currentUser.username === pro.name) {
      setIsEditing(false)
      updatePro(updatedPro)
    }
  }

  return (
    <li className="card">
      <img src={pro.image_url} alt={pro.name}/>
      <h3>{pro.name}</h3>
      <li>Services: {pro.service}</li>
      <li>Serves: {pro.area_served}</li>
      <Link to={`/pros/${pro.id}`} className="link">View profile</Link><br />
      {currentUser.username === pro.name ? (
        <>
          <button onClick={handleDelete}>Delete</button>&nbsp;
          <button onClick={() => setIsEditing((isEditing) => !isEditing)}>Edit</button>
        </>
      ) : null}
      {isEditing ? (
        <EditPro pro={pro} onUpdatePro={onUpdatePro} />
      ) : null}
    </li>
  )
}

export default ProCard

