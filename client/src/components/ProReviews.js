import ReviewForm from "./ReviewForm";

const ProReviews = ({ submitNewReview, reviews, pro }) => {
  return (
    <div className="app">
      <h3>Reviews:</h3>
      {reviews.map(review => 
        <ul key={review.id} className="reviews-list">
          <li>User: {review.user.username}</li>
          <li>Rating: {Array(review.rating).fill("⭐").join("")}</li>
          <li>{review.content}</li>
        </ul>
      )}
      <h3>Add a review for this pro</h3>
      <ReviewForm pro={pro} submitNewReview={submitNewReview}/>
    </div>
  )
}

export default ProReviews

