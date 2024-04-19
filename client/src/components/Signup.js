import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const Signup = ({ login, setErrors }) => {

  useEffect(() => {
    return () => {
      setErrors(null);
    }
  }, [])

  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username"),
    password: yup.string().required("Must enter a password"),
    email: yup.string().required("Must enter an email")
  })

  const formik = useFormik({
    initialValues: {
      "username": "",
      "password": "",
      "email": ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values, null, 2)
      })
      .then(resp => {
        if(resp.status === 201) { 
          resp.json().then(user => {
            login(user)
            navigate("/users")
          })
        }
        else {
          resp.json().then(error => setErrors(error.error))
        }
      })
    }
  })

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" id="username" value={formik.values.username} onChange={ formik.handleChange } />
          <p style={{color: "red"}}> {formik.errors.username}</p>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" value={formik.values.password} onChange={formik.handleChange} />
          <p style={{color: "red"}}> {formik.errors.password}</p>
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="text" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} />
          <p style={{color: "red"}}> {formik.errors.email}</p>
        </div>
        <input type="submit" value="Create Account" />
      </form>
    </div>
  )
}

export default Signup