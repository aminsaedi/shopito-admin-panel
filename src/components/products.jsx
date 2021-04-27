import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
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
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import HelpIcon from "@material-ui/icons/Help";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import GetAppIcon from "@material-ui/icons/GetApp";

import Num2persian from "num2persian";

import productsApi from "../api/product";
import useApi from "../hooks/useApi";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Products = ({ user }) => {
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [showPriceChange, setShowPriceChange] = useState(false);
  const [showCountChange, setShowCountChange] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [newPrice, setNewPrice] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [numberInStock, setNewNumberInStock] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);

  const [newProducName, setNewProductName] = useState("");
  const [newProductBarcode, setNewProductBarcode] = useState("");
  const [newProductNumberInStock, setNewProductNumberInStock] = useState(0);
  const [newProductPrice, setNewProductPrice] = useState(0);

  const getAllProductsApi = useApi(productsApi.getAllProductsInBranch);
  const changePriceApi = useApi(productsApi.updateProductPrice);
  const changeCountApi = useApi(productsApi.updateProductNumberInStock);
  const deleteProductApi = useApi(productsApi.deleteProduct);
  const addProductApi = useApi(productsApi.newProduct);

  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);
    return (
      <React.Fragment>
        <TableRow>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.name}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.numberInStock}
          </TableCell>
          <TableCell align="right" style={{ fontFamily: "IranSans" }}>
            {row.price}
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
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon className="ml-2" />}
                    style={{
                      width: "70%",
                      marginLeft: "15%",
                      fontFamily: "IranSans",
                    }}
                    onClick={() => {
                      setCurrentProduct(row);
                      setShowCountChange(true);
                    }}
                  >
                    ویراش موجودی
                  </Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon className="ml-2" />}
                    style={{
                      width: "50%",
                      marginLeft: "25%",
                      fontFamily: "IranSans",
                    }}
                    onClick={() => {
                      setCurrentProduct(row);
                      setConfirmDelete(true);
                    }}
                  >
                    حذف کالا
                  </Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="contained"
                    startIcon={<HelpIcon className="ml-2" />}
                    style={{
                      width: "80%",
                      marginLeft: "10%",
                      fontFamily: "IranSans",
                    }}
                  >
                    گزارش خرید محصول
                  </Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AttachMoneyIcon className="ml-2" />}
                    style={{
                      width: "50%",
                      marginLeft: "25%",
                      fontFamily: "IranSans",
                    }}
                    onClick={() => {
                      setCurrentProduct(row);
                      setShowPriceChange(true);
                    }}
                  >
                    تغیر قیمت
                  </Button>
                </div>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSetPrice = async () => {
    setShowPriceChange(false);
    await changePriceApi.request(currentProduct._id, newPrice);
    getAllProductsApi.request(user.branch._id);
    setNewPrice(0);
  };

  const handleSetCount = async () => {
    setShowCountChange(false);
    await changeCountApi.request(currentProduct._id, numberInStock);
    getAllProductsApi.request(user.branch._id);
    setNewNumberInStock(0);
  };

  const handleDelteProduct = async () => {
    setConfirmDelete(false);
    await deleteProductApi.request(currentProduct._id);
    getAllProductsApi.request(user.branch._id);
  };

  const handleAddProduct = async () => {
    setShowAddProductDialog(false);
    console.log(
      newProducName,
      newProductBarcode,
      user.branch._id,
      newProductPrice,
      newProductNumberInStock
    );
    await addProductApi.request(
      newProducName,
      newProductBarcode,
      user.branch._id,
      newProductPrice,
      newProductNumberInStock
    );
    console.log(addProductApi.data);
    getAllProductsApi.request(user.branch._id);
  };

  useEffect(() => {
    if (user) {
      getAllProductsApi.request(user.branch._id);
    }
  }, [user]);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, getAllProductsApi.data.length - page * rowsPerPage);

  return (
    <>
      <Backdrop open={getAllProductsApi.loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={showPriceChange} onClose={() => setShowPriceChange(false)}>
        <DialogTitle style={{ textAlign: "right" }}>تغیر قیمت</DialogTitle>
        <DialogTitle>
          <Typography style={{ textAlign: "right" }}>
            قیمت فعلی محصول : {currentProduct.price}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="newPrice"
            label="قیمت جدید"
            fullWidth
            onChange={(event) => setNewPrice(parseInt(event.target.value))}
          />
          <Typography>{Num2persian(newPrice)} تومان</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewPrice(0);
              setShowPriceChange(false);
            }}
            color="primary"
          >
            خروج
          </Button>
          <Button
            disabled={!newPrice || newPrice <= 0}
            onClick={handleSetPrice}
            color="primary"
          >
            تغیر قیمت
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showCountChange} onClose={() => setShowCountChange(false)}>
        <DialogTitle style={{ textAlign: "right", fontFamily: "IranSans" }}>
          تغیر تعداد در انبار
        </DialogTitle>
        <DialogTitle>
          <Typography style={{ textAlign: "right", fontFamily: "IranSans" }}>
            موجودی فعلی محصول : {currentProduct.numberInStock}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="newPrice"
            label="موجودی جدید"
            fullWidth
            onChange={(event) =>
              setNewNumberInStock(parseInt(event.target.value))
            }
            style={{ fontFamily: "IranSans" }}
          />
          <Typography style={{ textAlign: "right", fontFamily: "IranSans" }}>
            {Num2persian(numberInStock)} عدد
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewNumberInStock(0);
              setShowCountChange(false);
            }}
            color="primary"
          >
            خروج
          </Button>
          <Button
            disabled={!numberInStock || numberInStock <= 0}
            onClick={handleSetCount}
            color="primary"
          >
            تغیر تعداد
          </Button>
        </DialogActions>
      </Dialog>
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
      <Dialog
        open={showAddProductDialog}
        onClose={() => setShowAddProductDialog(false)}
        fullScreen
      >
        <DialogTitle style={{ textAlign: "right" }}>افزودن محصول</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="productName"
            label="نام محصول"
            fullWidth
            onChange={(event) => setNewProductName(event.target.value)}
          />
          <TextField
            margin="dense"
            id="productName"
            label="بارکد محصول"
            fullWidth
            onChange={(event) => setNewProductBarcode(event.target.value)}
          />
          <TextField
            margin="dense"
            id="numberInStock"
            label="تعداد در انبار"
            fullWidth
            type="number"
            onChange={(event) =>
              setNewProductNumberInStock(parseInt(event.target.value))
            }
          />
          <TextField
            margin="dense"
            id="price"
            label="قیمت"
            fullWidth
            type="number"
            onChange={(event) =>
              setNewProductPrice(parseInt(event.target.value))
            }
          />
          <Typography>{Num2persian(newProductPrice)} تومان</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setShowAddProductDialog(false)}
          >
            لغو
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleAddProduct}
          >
            افزودن محصول
          </Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <TableContainer>
          <Table stickyHeader aria-lable="لیست اجناس">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontFamily: "IranSansBold" }} align="right">
                  نام محصول
                </TableCell>
                <TableCell style={{ fontFamily: "IranSansBold" }} align="right">
                  تعداد در انبار
                </TableCell>
                <TableCell style={{ fontFamily: "IranSansBold" }} align="right">
                  قیمت
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {getAllProductsApi.status == 200 &&
                getAllProductsApi.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity) => <Row row={activity} key={activity._id} />)}
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
          count={getAllProductsApi.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div className="row m-2">
        <div className="col-sm-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon className="ml-2" />}
            onClick={setShowAddProductDialog}
            style={{ fontFamily: "IranSans",width:"100%" }}
          >
            افزودن محصول
          </Button>
        </div>
        <div className="col-sm-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon className="ml-2" />}
            style={{ fontFamily: "IranSans" }}
          >
            خروجی اکسل
          </Button>
        </div>
      </div>
      <Snackbar open={getAllProductsApi.error} autoHideDuration={5000}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          خطا در ارتباط با سرور
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Products;
