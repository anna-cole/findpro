import { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const Login = ({ login, setErrors }) => {

  useEffect(() => {
    return () => {
      setErrors(null);
    }
  }, [])

  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username").matches(/^[a-zA-Z ]*$/, 'Must enter only letters').min(4).max(15),
    password: yup.string().required("Must enter a password").min(4).max(15)
  })

  const formik = useFormik({
    initialValues: {
      "username": "",
      "password": ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values, null, 2)
      })
      .then(resp => {
        if(resp.status === 200) {
          resp.json().then(user => {
            login(user)
            navigate("/pros")
          })
        } else {
          resp.json().then(data => setErrors(data.error))
        }
      })
    }
  })

  return (
    <div className="app">
      <header>
        <img className="logo" src="https://t3.ftcdn.net/jpg/01/01/41/44/360_F_101414400_WRNfEX3hPMyVQSDzekuzXNqw7Ye1Ov1k.jpg" alt="logo" width="100" height="80"/>
        <img className="background-image" src="https://www.cleanarte.com/wp-content/uploads/2020/10/Top-To-Bottom-Deep-Cleaning.jpg.webp" alt="cleaner" width="500" height="300"/>
        <h2>Please enter your login details</h2>
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
        <button type="submit" className="submit-button">Log in</button>
      </form>
      <p> Don't have an account? &nbsp;
        <button color="secondary" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default Login