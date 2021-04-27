import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import * as locales from "@material-ui/core/locale";
import jwtDecode from "jwt-decode";
import "bootstrap/dist/css/bootstrap.css";


import "./App.css";
import HomePage from "./components/Home";
import ShopitoNavbar from "./components/ShopitoNavbar";
import Logout from "./components/logout";
import ActiveShoppings from "./components/ActiveShoppings";
import Products from "./components/products";
import Report from "./components/Report";
import OnlinePayments from "./components/OnlinePayments";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const theme = createMuiTheme(
  {
    direction: "rtl", // Both here and <body dir="rtl">
    fontFamily: "IranSans",
  },
  locales["faIR"]
);

function App() {
  const classes = useStyles();

  const [user, setUser] = useState();
  useEffect(() => {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      setUser(user);
    } catch (error) {
      return;
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} dir="rtl">
        <ShopitoNavbar user={user} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/report" component={Report} />
            <Route path="/products" render={() => <Products user={user} />} />
            <Route
              path="/activeShoppings"
              render={() => <ActiveShoppings user={user} />}
            />
            <Route
              path="/onlinePayments"
              render={() => <OnlinePayments user={user} />}
            />
            <Route path="/help" component={HomePage} />
            <Route path="/login" component={HomePage} />
            <Route path="/register" component={HomePage} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={HomePage} />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
