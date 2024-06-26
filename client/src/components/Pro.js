import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProReviews from "./ProReviews";

const Pro = () => {
  const [pro, setPro] = useState({});
  const [reviews, setReviews] = useState([]);
  const params = useParams();
  const proId = params.id;
 
  useEffect(() => {
    fetch(`/pros/${proId}`)
    .then(r => {
      if (r.ok) {
        r.json().then(pro => {
          setPro(pro)
          setReviews(pro.reviews)
        })
      }
    })
  }, [proId])

  const submitNewReview = (newReview) => {
    setReviews([...reviews, newReview])
  }
  
  if (!pro.name) {
    return <h1>Loading...</h1>
  }

  const proReviews = pro.reviews; 
  const totalRating = proReviews.reduce((accumulator, review) => accumulator + review.rating, 0);
  const averageRating = (totalRating / proReviews.length).toFixed(0);
  const stars = "⭐".repeat(averageRating)

  return (
    <div className="app">
      <h2>{pro.name}</h2>
      <img className="background-image" src={pro.image_url} alt={pro.name} width="300" height="300"/>
      <ul>
        <li>Average rating: {averageRating ? `${averageRating} ${stars}` : null}</li>
        <li>Services: {pro.service}</li>
        <li>Serves: {pro.area_served}</li>
      </ul>
      <ProReviews submitNewReview={submitNewReview} reviews={reviews} pro={pro}/>
    </div>
  )
}

export default Pro
  
 