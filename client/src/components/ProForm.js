import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';


const ProForm = ({ addPro, setErrors }) => {

  useEffect(() => {
    return () => {
      setErrors(null);
    }
  }, [])

  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup.string().required("Must enter a name").matches(/^[a-zA-Z ]*$/, 'Must enter only letters').min(4).max(15),
    image_url: yup.string(),
    service: yup.string().required("Must enter service").max(15),
    area_served: yup.string().required("Must enter area").max(20),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image_url: "",
      service: "",
      area_served: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/pros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then(r => {
        if (r.ok) {
          r.json().then(pro => {
            addPro(pro)
            navigate("/pros")
          })
        } else {
          r.json().then(error => setErrors(error.error)) 
        }
      })
    }
  })

  return (
    <div className="app">
      <header>
        <h1>Get jobs in your area!</h1>
        <p>What service do you provide?</p>
        <img className="background-image" src="https://images.ctfassets.net/xf6mqlbz6glx/6CPdWMwohdy1gLp1WJ7aLJ/1507e65cde66e825b5c03229a7429337/F5_NovArticle_11.16.jpg?fm=jpg&fl=progressive&w=960&q=80" alt="baby sitter" width="500" height="300"/>
      </header>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="name">Name</label>
        <br/>
        <input
          className="field"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}> {formik.errors.name}</p>
        <label htmlFor="image_url">Image</label>
        <br/>
        <input
          className="field"
          name="image_url"
          onChange={formik.handleChange}
          value={formik.values.image_url}
        />
        <p style={{ color: "red" }}> {formik.errors.image_url}</p>
        <label htmlFor="service">Service</label>
        <br/>
        <input
          className="field"
          name="service"
          onChange={formik.handleChange}
          value={formik.values.service}
        />
        <p style={{ color: "red" }}> {formik.errors.service}</p>
        <label htmlFor="area_served">Area served</label>
        <br/>
        <input
          className="field"
          name="area_served"
          onChange={formik.handleChange}
          value={formik.values.area_served}
        />
        <p style={{ color: "red" }}> {formik.errors.area_served}</p>
        <button type="submit" className="submit-button">Create account</button>
      </form>
    </div>
  )
}

export default ProForm
