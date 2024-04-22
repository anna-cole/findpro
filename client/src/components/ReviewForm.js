import { useFormik } from "formik";
import * as yup from "yup";

const ReviewForm = ({ pro, submitNewReview }) => {

  const formSchema = yup.object().shape({
    rating: yup.number().required("Must enter rating").positive().integer().typeError('Please enter an Integer').max(10),
    content: yup.string().required("Must enter a review").min(5).max(125),
  });

  const formik = useFormik({
    initialValues: {
      rating: "",
      content: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const reviewData = {
        ...values,
        pro_id : pro.id, 
      };
      // console.log("Review before fetch:", reviewData);
      fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData, null, 2),
      }).then(r => {
        if (r.ok) {
          r.json().then(review => {
            submitNewReview(review)
            formik.resetForm()
            // console.log("Review after fetch:", review);
          })
        } 
      })
      .catch((error) => console.log("Error:", error));
    }
  })

  return (
    <div className="app">
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="rating">Rating</label>
        <br />
        <input
          className="field"
          name="rating"
          onChange={formik.handleChange}
          value={formik.values.rating}
        />
        <p style={{ color: "red" }}> {formik.errors.rating}</p>
        <label htmlFor="content">Content</label>
        <br />
        <input
          className="field"
          name="content"
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        <p style={{ color: "red" }}> {formik.errors.content}</p>
        <button type="submit" className="submit-button">Create review</button>
      </form>
    </div>
  )
}

export default ReviewForm
