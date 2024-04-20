import { useEffect } from 'react';
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
    username: yup.string().required("Must enter a username").matches(/^[a-zA-Z ]*$/, 'Must enter only letters').min(4).max(15),
    email: yup.string().required("Must enter email").email("Invalid email"),
    password: yup.string().required("Must enter a password").min(4).max(15)
  })

  const formik = useFormik({
    initialValues: {
      "username": "",
      "email": "",
      "password": ""
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
            navigate("/pros")
          })
        } else {
          resp.json().then(error => setErrors(error.error))
        }
      })
    }
  })

  return (
    <div className="app">
      <header>
        <h1>Create your account</h1>
        <img className="background-image" src="https://media.timeout.com/images/103004482/1024/576/image.webp" alt="musician" width="500" height="300"/>
      </header>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <div>
          <label htmlFor="username">Username</label>
          <br />
          <input
            input type="text"
            className="field"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          <p style={{ color: "red" }}> {formik.errors.username}</p>
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <br />
          <input
            input type="email"
            className="field"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <p style={{ color: "red" }}> {formik.errors.email}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            input type="password"
            className="field"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <p style={{ color: "red" }}> {formik.errors.password}</p>
        </div>
        <div className='password'>
          <p>Your password must:</p>
          <ul>
            <li>be 4 to 15 characters long</li>
            <li>not be commonly used or easily guessed</li>
          </ul>
        </div>
        <button type="submit" className="submit-button">Create account</button>
      </form>
      <p> Already have an account? &nbsp;
        <button color="secondary" onClick={() => navigate("/login")}>
          Log In
        </button>
      </p>
    </div>
  )
}

export default Signup