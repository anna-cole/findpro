import { Link } from "react-router-dom";

const ProCard = ({ pro }) => {

  return (
    <li className="card">
      <img src={pro.image_url} alt={pro.name}/>
      <h3>{pro.name}</h3>
      <li>Services: {pro.service}</li>
      <li>Serves: {pro.area_served}</li>
      <Link to={`/pros/${pro.id}`} className="link">View profile</Link><br />
    </li>
  )
}

export default ProCard

