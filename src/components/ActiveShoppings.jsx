import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PaymentIcon from "@material-ui/icons/Payment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MoneyIcon from "@material-ui/icons/Money";
import { makeStyles } from "@material-ui/core/styles";
import Num2persian from "num2persian";

import shoppingsApi from "../api/shopping";
import useApi from "../hooks/useApi";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const getTotalPrice = (products) => {
  let total = 0;
  products.forEach((item) => (total += item.price));
  return total;
};

const ActiveShoppings = ({ user }) => {
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [showReceipt, setShowReceipy] = useState(false);
  const [receipt, setReceipt] = useState();
  const [showPaymnet, setShowPayment] = useState(false);
  const [currentShopping, setCurrentShopping] = useState("");
  const getActiveShoppingsApi = useApi(shoppingsApi.activeShoppings);
  const finishShoppingApi = useApi(shoppingsApi.finishShopping);

  const getSortedProducts = (allProduct) => {
    const result = [
      ...allProduct
        .reduce((mp, o) => {
          const key = JSON.stringify([o.name, o.price]);
          if (!mp.has(key)) mp.set(key, { ...o, count: 0 });
          mp.get(key).count++;
          return mp;
        }, new Map())
        .values(),
    ];
    return result;
  };

  const finishShopping = async (shoppingId, statusCode) => {
    await finishShoppingApi.request(shoppingId, statusCode);
    return finishShoppingApi.status;
  };

  const priceFormater = (inputPrice) => {
    if (!inputPrice) return 0;
    return inputPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);
    return (
      <React.Fragment>
        <TableRow>
          <TableCell align="right" style={{ fontFamily: "Vazir-Black" }}>
            {row.customer.name}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "Vazir-Black" }}>
            {row.products.length}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "Vazir-Black" }}>
            {priceFormater(getTotalPrice(row.products))}
          </TableCell>
          <TableCell>
            <IconButton
              aria-label="نمایش جزییات"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="row m-2">
                <div className="col-sm-3 my-auto">
                  <Typography style={{ textAlign: "right" }}>
                    شماره موبایل مشتری : {row.customer.mobile}
                  </Typography>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PaymentIcon className="ml-2" />}
                    onClick={() => {
                      setCurrentShopping(row);
                      setShowPayment(true);
                    }}
                  >
                    پرداخت
                  </Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    startIcon={<ReceiptIcon className="ml-2" />}
                    onClick={() => {
                      setReceipt(getSortedProducts(row.products));
                      setShowReceipy(true);
                    }}
                  >
                    فاکتور خرید
                  </Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CancelIcon className="ml-2" />}
                    onClick={() => {
                      finishShopping(row._id, 5);
                      window.location = "/activeShoppings";
                    }}
                  >
                    انصراف مشتری
                  </Button>
                </div>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const FactorRow = ({ row }) => {
    return (
      <TableRow>
        <TableCell align="right" style={{ fontFamily: "IranSans" }}>
          {Num2persian(row.count * row.price)} تومان
        </TableCell>
        <TableCell align="right" style={{ fontFamily: "IranSans" }}>
          {priceFormater(row.count * row.price)}
        </TableCell>
        <TableCell align="right" style={{ fontFamily: "IranSans" }}>
          {priceFormater(row.price)}
        </TableCell>
        <TableCell align="right" style={{ fontFamily: "IranSans" }}>
          {row.count}
        </TableCell>
        <TableCell align="right" style={{ fontFamily: "IranSans" }}>
          {row.name}
        </TableCell>
      </TableRow>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (user) {
      getActiveShoppingsApi.request(user.branch._id);
      setInterval(() => {
        getActiveShoppingsApi.request(user.branch._id);
      }, 60000);
    }
  }, [user]);

  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      getActiveShoppingsApi.data.length - page * rowsPerPage
    );

  return (
    <>
      <Backdrop
        open={getActiveShoppingsApi.loading}
        className={classes.backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        fullScreen
        open={showReceipt}
        onClose={() => setShowReceipy(false)}
      >
        <DialogTitle style={{ textAlign: "right" }} id="receipy-dialog-title">
          فاکتور مشتری
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table aria-lable="فاکتور مشتری">
              <TableHead>
                <TableRow>
                  <TableCell style={{fontFamily:"IranSansBold"}} align="right">قیمت کل(حروف)</TableCell>
                  <TableCell style={{fontFamily:"IranSansBold"}} align="right">قیمت کل</TableCell>
                  <TableCell style={{fontFamily:"IranSansBold"}} align="right">قیمت</TableCell>
                  <TableCell style={{fontFamily:"IranSansBold"}} align="right">تعداد</TableCell>
                  <TableCell style={{fontFamily:"IranSansBold"}} align="right">محصول</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipt &&
                  receipt.map((product) => (
                    <FactorRow key={product._id} row={product} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceipy(false)} color="primary">
            خروج
          </Button>
          <Button
            disabled
            onClick={() => console.log("Printing...")}
            color="primary"
          >
            چاپ
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showPaymnet} onClose={() => setShowPayment(false)}>
        <DialogTitle id="payment-dialog-title" style={{ textAlign: "center",fontFamily:"IranSans" }}>
          پرداخت {currentShopping && currentShopping.customer.name}
        </DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="col-sm-6">
              <Button
                variant="contained"
                color="primary"
                className="m-2"
                endIcon={<MoneyIcon />}
                fullWidth
                onClick={() => {
                  finishShopping(currentShopping._id, 3);
                  window.location = "/activeShoppings";
                }}
              >
                نقدی
              </Button>
            </div>
            <div className="col-sm-6">
              <Button
                variant="contained"
                color="primary"
                className="m-2"
                endIcon={<PaymentIcon />}
                fullWidth
                onClick={() => {
                  finishShopping(currentShopping._id, 4);
                  window.location = "/activeShoppings";
                }}
              >
                کارتخوان
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPayment(false)} color="primary">
            خروج
          </Button>
        </DialogActions>
      </Dialog>
      {getActiveShoppingsApi.status === 200 && (
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-lable="لیست مشتری ها">
              <TableHead>
                <TableRow>
                  <TableCell style={{fontFamily:"IranSans"}} align="right">مشتری</TableCell>
                  <TableCell style={{fontFamily:"IranSans"}} align="right">تعداد اجناس در سبد</TableCell>
                  <TableCell style={{fontFamily:"IranSans"}} align="right">مبلغ کل</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {getActiveShoppingsApi.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity) => (
                    <Row row={activity} key={activity._id} />
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 64 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              15,
              20,
              { value: -1, label: "نمایش همه" },
            ]}
            component="div"
            count={getActiveShoppingsApi.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Snackbar open={getActiveShoppingsApi.error} autoHideDuration={5000}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          {getActiveShoppingsApi.status >= 500
            ? "خطا در ارتباط با سرور"
            : getActiveShoppingsApi.data}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ActiveShoppings;
