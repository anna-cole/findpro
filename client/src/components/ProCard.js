import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import EditPro from "./EditPro";

const ProCard = ({ pro, deletePro, updatePro }) => {
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetch("/check_session")
    .then(r => {
      if (r.ok) {
        r.json().then(user => {
          setUser(user)
          isUser(user)
        })
      }
    })
  }, [])

  const isUser = user => {
    if (user.id === pro.id) {
      setIsCurrentUser(!isCurrentUser)
    }
  }

  const handleDelete = () => {
    if (isCurrentUser) {
      fetch(`/pros/${pro.id}`, {method: "DELETE"})
      deletePro(pro.id)
      alert("Deleted Successfully")
    } 
  }

  const onUpdatePro = updatedPro => {
    if (isCurrentUser) {
      setIsEditing(false)
      updatePro(updatedPro)
    }
  }
  
  return (
    <li className="card">
      <img src={pro.image_url} alt={pro.name}/>
      <h3>{pro.name}</h3>
      <li>Services: {pro.service}<br />
      Serves: {pro.area_served}</li>
      <Link to={`/pros/${pro.id}`} className="link">View profile</Link><br />
      {isEditing ? (
        <EditPro pro={pro} onUpdatePro={onUpdatePro} />
      ) : null}
      {isCurrentUser ? (
        <>
          <button onClick={handleDelete}>Delete</button>&nbsp;
          <button onClick={() => setIsEditing((isEditing) => !isEditing)}>Edit</button>
        </>
      ) : null}
    </li>
  )
}

export default ProCard

