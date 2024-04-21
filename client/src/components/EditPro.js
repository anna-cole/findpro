import { useFormik } from "formik";
import * as yup from "yup";

const EditPro = ({ pro, onUpdatePro }) => {

  const formSchema = yup.object().shape({
    name: yup.string().required("Must enter a name").matches(/^[a-zA-Z ]*$/, 'Must enter only letters').min(4).max(15),
    image_url: yup.string(),
    service: yup.string().required("Must enter service").max(15),
    area_served: yup.string().required("Must enter area").max(20),
  });

  const formik = useFormik({
    initialValues: {
      name: pro.name,
      image_url: pro.image_url,
      service: pro.service,
      area_served: pro.area_served,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/pros/${pro.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then(r => {
        if (r.ok) {
          r.json().then(updatedPro => {
            onUpdatePro(updatedPro)
          })
        } 
      })
    },
  })

  return (
    <form className="edit-message" onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
      <label htmlFor="name">Name</label>
      <br/>
      <input
        type="text"
        className="field"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <p style={{ color: "red" }}> {formik.errors.name}</p>
      <label htmlFor="image_url">Image</label>
      <br/>
      <input
        type="url"
        className="field"
        name="image_url"
        onChange={formik.handleChange}
        value={formik.values.image_url}
      />
      <p style={{ color: "red" }}> {formik.errors.image_url}</p>
      <label htmlFor="service">Service</label>
      <br/>
      <input
        type="text"
        className="field"
        name="service"
        onChange={formik.handleChange}
        value={formik.values.service}
      />
      <p style={{ color: "red" }}> {formik.errors.service}</p>
      <label htmlFor="area_served">Area served</label>
      <br/>
      <input
        type="text"
        className="field"
        name="area_served"
        onChange={formik.handleChange}
        value={formik.values.area_served}
      />
      <p style={{ color: "red" }}> {formik.errors.area_served}</p>
      <input type="submit" value="Save"/>
    </form>
  )
}

export default EditPro
