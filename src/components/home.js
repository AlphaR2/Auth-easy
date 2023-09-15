import React, { useState } from "react";
import { GiAbstract062 } from "react-icons/gi";
import "./home.css";
import home from "../images/home3.jpg"

const Home = ({ login }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="home-container">
      <div className="home-img">
        <img src={home} alt="home"/>
      </div>
      {/* Navigation Bar */}
      <div className="nav-bar">
        <a className="logo">
          <GiAbstract062 />
        </a>
        <button onClick={toggleModal} className="card">
          Get Started
        </button>
      </div>

      {/* Main Content */}
      <div className="container-main">
        <h1>Leap into Tomorrow: Master On-chain Analysis for Solana's  Revolution</h1>
        <p>Explore the potential of data research and analysis within the solana ecosystem.</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Swift onboarding Powered by <br></br>
              <a href="https://web3auth.io/">Web3Auth</a>
               </h2>
            <ul>
              <li>Sign up with any social account</li>
              <li>Get Authenticated in few minutes</li>
              <li>Get your own personal wallet instantly without any hassle</li>
              <li>Transact easily with Torus Wallet </li>
            </ul>
            {/* Place your login component or button here */}
            <button onClick={toggleModal} onMouseUp={login} className="modal-login-button">
              Log In
            </button>
            <button onClick={toggleModal} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
