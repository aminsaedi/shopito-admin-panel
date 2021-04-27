import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import "./homeStyle.css";
import logo from "../assets/logo.png";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="container">
          <img src={logo} width="20%" height="20%" style={{marginLeft:"40%"}}  />
          <h1
            style={{
              fontFamily: "IranSansBold",
              textAlign: "center",
              marginTop: "3%",
              fontSize: 50,
            }}
          >
            شــاپــیــتــو
          </h1>
          <h3 className="subtitle">
            با استفاده از شاپیتو میتونی خیلی راحت فروشگاهتو مدیریت کنی
          </h3>
          <br />
          <div
            style={{
              marginTop: 50,
            }}
            className="row"
          >
            <div className="col-sm-5 mb-2">
              <Button
                fullWidth
                component={Link}
                to="/activeShoppings"
                variant="outlined"
                color="primary"
                size="large"
                className="button"
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: "IranSans",
                }}
              >
                مشتری های داخل فروشگاه
              </Button>
            </div>
            <div className="col-sm-2"></div>
            <div className="col-sm-5 mb-2">
              <Button
                fullWidth
                component={Link}
                to="/onlinePayments"
                variant="outlined"
                color="primary"
                size="large"
                className="button"
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: "IranSans",
                }}
              >
                پرداخت های آنلاین
              </Button>
            </div>
          </div>
        </div>
        <ParticlesBg type="cobweb" color="#0000FF" bg={true} />
      </>
    );
  }
}

export default HomePage;
