import React, { useEffect } from "react";
import { GiAbstract062 } from "react-icons/gi";
import mainImage from "../images/main.jpg";
import "./main.css";

const Main = ({
  getUserInfo,
  fetchAccounts,
  userData,
  isLoggedIn,
  logout,
  publik,
}) => {
  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo();
      fetchAccounts();
    }
  }, [getUserInfo, fetchAccounts, isLoggedIn]);

  return (
    <div className="loggedIn">
      <div className="main-img">
        <img src={mainImage} alt="Main" />
      </div>
      <div className="nav-bar">
        <a href="#" className="logo-menu">
          <GiAbstract062 />
        </a>
        <button onClick={logout} className="card-out">
          Log Out
        </button>
      </div>

      <div className="nav-logged">
        {isLoggedIn ? (
          <div className="solana">
            Welcome Home to Solana{" "}
            <span className="solana">
              {userData.name}
            </span>
          </div>
        ) : (
          <div>
            <p>Authentication Failed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
