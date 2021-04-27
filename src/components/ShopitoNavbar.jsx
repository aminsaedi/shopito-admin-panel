import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import FormControl from "@material-ui/core/FormControl";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MuiAlert from "@material-ui/lab/Alert";
import PaymentIcon from "@material-ui/icons/Payment";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import StorageIcon from "@material-ui/icons/Storage";
import StoreIcon from "@material-ui/icons/Store";
import TextField from "@material-ui/core/TextField";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { Link } from "react-router-dom";

import chashApi from "../api/chash";
import branchApi from "../api/branch";
import motherPasswordApi from "../api/motherPassword";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginRight: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    right: 0,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
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
  title: {
    flexGrow: 1,
    textAlign: "right",
    marginRight: "2%",
  },
}));

const ShopitoNavbar = ({ user }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState(0);
  const [] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [motherPassword, setMotherPassword] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [chashName, setChashName] = useState("");

  const registerSteps = [
    "رمز مادر را وارد کنید",
    "شعبه خود را انتخاب کنید",
    "نام کاربری و رمز عبور خود را انتخاب کنید",
  ];

  const getAllBranches = async () => {
    const response = await branchApi.getAllBranches();
    if (response.status === 200) setBranches(response.data);
  };

  useEffect(() => {
    getAllBranches();
  }, []);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            autoFocus
            margin="dense"
            id="motherPassword"
            label="رمز مادر"
            fullWidth
            onChange={(event) =>
              setMotherPassword(parseInt(event.target.value))
            }
          />
        );
      case 1:
        return (
          <>
            <FormControl fullWidth style={{ marginBottom: 10 }}>
              <InputLabel id="selecct-branch-lable" style={{fontFamily:"IranSans"}} >
                شعبه را انتخاب کنید
              </InputLabel>
              <Select
                labelId="select-branch-lable"
                id="select-branch"
                value={selectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
              >
                {branches.map((branch) => (
                  <MenuItem value={branch._id}>{branch.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="chashName"
              label="اسم صندوق دار"
              fullWidth
              onChange={(event) => setChashName(event.target.value.toString())}
              helperText="پیش فرض : (صندوق دار)"
            />
            <TextField
              margin="dense"
              id="username"
              label="نام کاربری"
              fullWidth
              onChange={(event) => setUsername(event.target.value.toString())}
            />
            <br />
            <TextField
              margin="dense"
              id="password"
              label="رمز عبور"
              type="password"
              fullWidth
              onChange={(event) => setPassword(event.target.value.toString())}
            />
          </>
        );
      default:
        return <h3>خطا</h3>;
    }
  };

  const handleCheckMotherPassword = async () => {
    const result = await motherPasswordApi.checkPassword(motherPassword);
    if (result.status !== 200) {
      setError(true);
      setErrorMessage("رمز صحیح نیست");
      return;
    }
    setRegisterStep(registerStep + 1);
  };

  const handleSelectBranch = () => {
    if (!selectedBranch) {
      setError(true);
      setErrorMessage("شعبه را انتخاب کنید");
      return;
    }
    setRegisterStep(registerStep + 1);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError(true);
      setErrorMessage("نام کاربری و/یا رمز را وارد کنید");
      return;
    }
    const response = await chashApi.registerChash(
      chashName ? chashName : "صندوق دار",
      username,
      password,
      selectedBranch
    );
    if (response.status === 201) {
      localStorage.setItem("token", response.data);
      window.location = "/";
    }
    if (response.data === "username aleardy exists.") {
      setError(true);
      setErrorMessage("نام کاربری تکراری است");
    }
    if (response.data === "no branch.") {
      setError(true);
      setErrorMessage("خطا در انتخاب شعبه");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError(true);
      setErrorMessage("نام کاربری و/یا رمز را وارد کنید");
      return;
    }
    const response = await chashApi.loginChash(username, password);
    if (response.status === 200) {
      localStorage.setItem("token", response.data);
      window.location = "/";
      return;
    }
    if (response.status === 400) {
      setError(true);
      setErrorMessage("نام کاربری و/یا رمز عبور اشتباه است");
      return;
    } else {
      setError(true);
      setErrorMessage("خطا در ورود");
      return;
    }
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={() => {
          setError(false);
        }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          {errorMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog open={showRegisterForm} fullWidth>
        <DialogTitle
          id="login-form-title"
          style={{ fontFamily: "IranSansBold" }}
        >
          ایجاد صندوق دار جدید
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={registerStep} orientation="vertical">
            {registerSteps.map((lable, index) => (
              <Step key={lable}>
                <StepLabel style={{ fontFamily: "IranSans" }}>
                  {lable}
                </StepLabel>
                <StepContent>
                  {getStepContent(index)}
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (index === 0) handleCheckMotherPassword();
                      if (index === 1) handleSelectBranch();
                      if (index === 2) handleRegister();
                    }}
                  >
                    {index === 0 && "انتخاب شعبه"}
                    {index === 1 && "مرحله بعد"}
                    {index === 2 && "ثبت نام"}
                  </Button>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRegisterStep(registerStep - 1)}
            disabled={registerStep < 1}
          >
            مرحله قبل
          </Button>
          <Button onClick={() => setShowRegisterForm(false)}>لغو</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showLoginForm} fullWidth>
        <DialogTitle id="login-form-title">ورود صندوق دار</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="نام کاربری"
            fullWidth
            onChange={(event) => setUsername(event.target.value.toString())}
          />
          <br />
          <TextField
            margin="dense"
            id="password"
            label="رمز عبور"
            type="password"
            fullWidth
            onChange={(event) => setPassword(event.target.value.toString())}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} disabled={!username || !password}>
            ورود
          </Button>
          <Button onClick={() => setShowLoginForm(false)}>لغو</Button>
        </DialogActions>
      </Dialog>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <ToolBar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="end"
            className={clsx(classes.menuButton, { [classes.hide]: open })}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWarp
            className={classes.title}
            style={{ fontFamily: "IranSans" }}
          >
            شاپیتو
          </Typography>

          {!user ? (
            <>
              <Button onClick={() => setShowLoginForm(true)} color="inherit">
                ورود
              </Button>
              <Button onClick={() => setShowRegisterForm(true)} color="inherit">
                ثبت نام
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/logout"
              color="inherit"
              style={{ fontFamily: "IranSansLight" }}
            >
              {user.name} در {user.branch.name}
            </Button>
          )}
        </ToolBar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key="home" component={Link} to="/">
            <ListItemIcon>
              <HomeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="صفحه اصلی" />
          </ListItem>
          <ListItem
            button
            key="activeShoppings"
            component={Link}
            to="/activeShoppings"
          >
            <ListItemIcon>
              <StoreIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="مشتری های داخل فروشگاه" />
          </ListItem>
          <ListItem
            button
            key="onlinePayments"
            component={Link}
            to="/onlinePayments"
          >
            <ListItemIcon>
              <PaymentIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="خرید های آنلاین" />
          </ListItem>
          <ListItem button key="acitivities" component={Link} to="/products">
            <ListItemIcon>
              <StorageIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="انبار" />
          </ListItem>
          <ListItem button key="report" component={Link} to="/report">
            <ListItemIcon>
              <ImportExportIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="گزارش گیر" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default ShopitoNavbar;
