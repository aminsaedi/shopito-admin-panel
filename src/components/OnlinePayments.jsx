import React, { useState, useEffect } from "react";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TablePagination from "@material-ui/core/TablePagination";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

import useApi from "../hooks/useApi";
import onlinePaymentsApi from "../api/onlinePaymnet";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const OnlinePayments = ({ user }) => {
  const classes = useStyles();
  const getOnlinePaymentsApi = useApi(
    onlinePaymentsApi.getOnlinePaymentsInBranch
  );
  const deleteOnlinePaymentApi = useApi(onlinePaymentsApi.deleteOnlinePayment);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPayment, setCurrentPayment] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getTotalPrice = (products) => {
    let total = 0;
    products.forEach((item) => (total += item.price));
    return total;
  };
  const priceFormater = (inputPrice) => {
    if (!inputPrice) return 0;
    return inputPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    if (user) {
      getOnlinePaymentsApi.request(user.branch._id);
      setInterval(() => {
        getOnlinePaymentsApi.request(user.branch._id);
      }, 60000);
    }
  }, [user]);
  const handleDelteProduct = async () => {
    setConfirmDelete(false);
    await deleteOnlinePaymentApi.request(currentPayment._id);
    getOnlinePaymentsApi.request(user.branch._id);
  };
  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);
    return (
      <React.Fragment>
        <TableRow>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {priceFormater(row.amount)}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.mobile}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.transId}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.shopping.date}
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
                  <Typography
                    style={{ textAlign: "right", fontFamily: "IranSans" }}
                  >
                    شماره کارت : {row.cardNumber}
                  </Typography>
                </div>
                <div className="col-sm-3 my-auto">
                  <Typography
                    style={{ textAlign: "right", fontFamily: "IranSans" }}
                  >
                    وضعیت : {row.message}
                  </Typography>
                </div>
                <div className="col-sm-3 my-auto">
                  <Typography
                    style={{ textAlign: "right", fontFamily: "IranSans" }}
                  >
                    خطا در جمع :{" "}
                    {getTotalPrice(row.shopping.products) * 10 ===
                    parseInt(row.amount)
                      ? "خیر"
                      : "بله " + getTotalPrice(row.shopping.products) * 10}
                  </Typography>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CancelIcon className="ml-2" />}
                    onClick={() => {
                      setCurrentPayment(row);
                      setConfirmDelete(true);
                    }}
                  >
                    حذف رکورد
                  </Button>
                </div>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };
  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      getOnlinePaymentsApi.data.length - page * rowsPerPage
    );

  return (
    <>
      <Backdrop
        open={getOnlinePaymentsApi.loading}
        className={classes.backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={confirmDelete}>
        <DialogTitle style={{ textAlign: "right" }}>حدف محصول </DialogTitle>
        <DialogContent>
          <Typography>تایید حذف محصول؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            varint="contained"
            color="primary"
            onClick={() => setConfirmDelete(false)}
          >
            لغو
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelteProduct()}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      {getOnlinePaymentsApi.status === 200 && (
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-lable="پرداخت های آنلاین">
              <TableHead>
                <TableRow>
                  <TableCell align="right">مبلغ</TableCell>
                  <TableCell align="right">شماره موبایل</TableCell>
                  <TableCell align="right">شماره تراکنش</TableCell>
                  <TableCell align="right">تاریخ خرید</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {getOnlinePaymentsApi.data
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
            count={getOnlinePaymentsApi.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Snackbar open={getOnlinePaymentsApi.error} autoHideDuration={5000}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          {getOnlinePaymentsApi.status >= 500
            ? "خطا در ارتباط با سرور"
            : getOnlinePaymentsApi.data}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default OnlinePayments;
