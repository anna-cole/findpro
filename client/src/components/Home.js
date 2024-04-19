import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div className="app">
      <header>
        <img className="logo" src="https://t3.ftcdn.net/jpg/01/01/41/44/360_F_101414400_WRNfEX3hPMyVQSDzekuzXNqw7Ye1Ov1k.jpg" alt="logo" width="100" height="80"/>
        <img className="background-image" src="https://s3da-design.com/wp-content/uploads/2021/12/Professional-Remodeler.png" alt="remodeler" width="500" height="300"/>
      </header>
      <h1>Welcome to Findpro!</h1>
      <h2>Find here service providers for all your needs!</h2>
      <Link to="/login">
        <button type="submit" className="submit-button">Find a pro</button>
      </Link>
    </div>
  )
}

export default Home