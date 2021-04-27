import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Container,
  Box,
  Paper,
  Typography,
  Breadcrumbs,
  Chip,
  Slider,
  IconButton
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon
} from "@material-ui/icons";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import debounce from "lodash-es/debounce";

import { restaurant, toast, progress, review } from "redux/actions";
import ReplyModal from "components/ReplyModal";
import CreateRestaurant from "components/CreateRestaurant";
import UpdateRestaurant from "components/UpdateRestaurant";
import Confirm from "components/Confirm";
import StyledBreadcrumb from "components/StyledBreadcrumb";

const columns = [
  {
    id: "no",
    numieric: true,
    disablePadding: true,
    label: "No",
    align: "center"
  },
  { id: "name", numeric: true, label: "Name", align: "center" },
  { id: "user", disablePadding: true, label: "User", align: "center" },
  {
    id: "overall_rating",
    disablePadding: true,
    label: "Overall Rate",
    align: "center"
  },
  {
    id: "highest_rating",
    disablePadding: true,
    label: "Highest Rate",
    align: "center"
  },
  {
    id: "lowest_rating",
    disablePadding: true,
    label: "Lowest Rate",
    align: "center"
  },
  { id: "action", disablePadding: true, label: "", align: "center" }
];

const review_columns = [
  {
    id: "no",
    numieric: true,
    disablePadding: true,
    label: "No",
    align: "center",
    maxWidth: "1rem"
  },
  {
    id: "rate",
    numeric: true,
    label: "Rate",
    align: "center",
    maxWidth: "10rem"
  },
  {
    id: "user",
    disablePadding: true,
    label: "User",
    align: "center",
    maxWidth: "10rem"
  },
  {
    id: "restaurant",
    disablePadding: true,
    label: "Restaurant",
    align: "center",
    maxWidth: "10rem"
  },
  {
    id: "comment",
    disablePadding: true,
    label: "Comment",
    align: "center",
    maxWidth: "18rem"
  },
  {
    id: "reply",
    disablePadding: true,
    label: "Reply",
    align: "center",
    maxWidth: "18rem"
  },
  {
    id: "date",
    disablePadding: true,
    label: "Visit Date",
    align: "center",
    maxWidth: "9rem"
  },
  {
    id: "action",
    disablePadding: true,
    label: "",
    align: "center",
    maxWidth: "5rem"
  }
];

const useStyles = makeStyles({
  root: {
    marginTop: "1rem",
    width: "100%"
  },
  container: {
    maxHeight: 640
  },
  createbutton: {
    float: "right"
  },
  boxMargin: {
    marginBottom: 0
  },
  crumbs: {
    marginTop: "1rem"
  },
  restaurant: {
    float: "right",
    marginTop: "70px"
  },
  dialog: {
    width: "30rem"
  },
  slider: {
    width: "20rem",
    margin: "auto"
  },
  user: {
    marginTop: "0.5rem"
  }
});

const Dashboard = props => {
  const classes = useStyles();
  const history = useHistory();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState({});
  const [replyOpen, setReplyModalOpen] = useState(false);
  const [range, setRange] = useState([0, 5]);
  const [id, setId] = useState("");

  const {
    getRestaurants,
    getPendingReviews,
    deleteRestaurant,
    showToast,
    userInfo,
    restaurants = [],
    restaurant,
    setParams,
    setReviewParams,
    params,
    count,
    reviews = [],
    reviewCount,
    reviewParams,
    currentReview
  } = props;

  const setDebouncedParams = useCallback(
    debounce(newvalue => {
      if (newvalue && newvalue.length === 2) {
        setParams({ min: newvalue[0], max: newvalue[1] });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    getRestaurants({ params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, count, restaurant]);

  useEffect(() => {
    if (userInfo.role === "owner") {
      getPendingReviews({ params: reviewParams });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewParams, reviewCount, currentReview]);

  useEffect(() => {
    setDebouncedParams(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const handleChangeRange = (event, newValue) => {
    setRange(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setParams({ page: newPage + 1 });
  };

  const handleChangeLimitPage = event => {
    setParams({ pageSize: event.target.value, page: 1 });
  };

  const handleChangeReviewPage = (event, newPage) => {
    setReviewParams({ page: newPage + 1 });
  };

  const handleChangeReviewLimitPage = event => {
    setReviewParams({ pageSize: event.target.value, page: 1 });
  };

  const handleClick = event => {
    event.preventDefault();
  };

  const handleDeleteSubmit = () => {
    setDeleteOpen(false);

    deleteRestaurant({
      id: selectedRow._id,
      body: {},
      success: () => {
        showToast({
          message: "You successfully deleted selected restaurant!",
          intent: "success",
          timeout: 3000
        });
      },
      fail: err => {
        showToast({
          message: err.response.data.message,
          intent: "error"
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Container fixed>
        {userInfo.role === "owner" && (
          <Chip
            className={classes.restaurant}
            icon={<AddIcon />}
            color="primary"
            label="Create restaurant"
            onClick={() => setCreateOpen(true)}
          />
        )}
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          className={classes.crumbs}
        >
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Restaurants"
            icon={<HomeIcon fontSize="small" />}
            onClick={handleClick}
          />
        </Breadcrumbs>
        <div
          className={classes.slider}
          style={{ marginLeft: "20px", marginTop: "20px" }}
        >
          <Typography id="discrete-slider-custom" gutterBottom>
            Rating
          </Typography>
          <Slider
            value={range}
            onChange={handleChangeRange}
            min={0}
            max={5}
            step={0.1}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </div>
        <h3>Restaurant List</h3>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => {
                    if (column.id === "user" && userInfo.role !== "admin")
                      return null;
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {restaurants.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map(column => {
                        const value =
                          column.id === "no"
                            ? params.pageSize * (params.page - 1) + index + 1
                            : row[column.id];
                        if (column.id === "user" && userInfo.role !== "admin")
                          return null;
                        else if (
                          column.id === "user" &&
                          userInfo.role === "admin"
                        ) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {row[column.id].firstName +
                                " " +
                                row[column.id].lastName +
                                " (" +
                                row[column.id].email +
                                ")"}
                            </TableCell>
                          );
                        } else if (column.id === "action")
                          return (
                            <React.Fragment key={column.id}>
                              <TableCell align={column.align}>
                                {(userInfo.role === "admin" ||
                                  userInfo.role === "owner") && (
                                  <React.Fragment>
                                    <IconButton
                                      aria-label="details"
                                      onClick={() => {
                                        setSelectedRow(row);
                                        setUpdateOpen(true);
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      aria-label="details"
                                      onClick={() => {
                                        setSelectedRow(row);
                                        setDeleteOpen(true);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </React.Fragment>
                                )}
                                <IconButton
                                  aria-label="details"
                                  onClick={() => {
                                    history.push(`/restaurants/${row._id}`);
                                  }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </React.Fragment>
                          );
                        else if (
                          column.id === "overall_rating" ||
                          column.id === "highest_rating" ||
                          column.id === "lowest_rating"
                        )
                          return (
                            <React.Fragment key={column.id}>
                              <TableCell align={column.align}>
                                <Box
                                  mb={3}
                                  className={classes.boxMargin}
                                  borderColor="transparent"
                                >
                                  <Rating
                                    name="read-only"
                                    value={value}
                                    precision={0.1}
                                    readOnly
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                  />
                                </Box>
                              </TableCell>
                            </React.Fragment>
                          );
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={count}
            rowsPerPage={params.pageSize}
            page={params.page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeLimitPage}
          />
        </Paper>
        {userInfo.role === "owner" && <h3>Pending Reply List</h3>}
        {userInfo.role === "owner" && (
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {review_columns.map(column => {
                      if (column.id !== "action")
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ width: column.maxWidth }}
                          >
                            {column.label}
                          </TableCell>
                        );
                      else if (userInfo.role !== "regular")
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ width: column.maxWidth }}
                          >
                            {column.label}
                          </TableCell>
                        );
                      else return null;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {review_columns.map(column => {
                          const value =
                            column.id === "no"
                              ? (reviewParams.page - 1) * reviewParams.pageSize + index + 1
                              : column.id === "user"
                              ? row["from_user"]["firstName"] +
                                " " +
                                row["from_user"]["lastName"]
                              : column.id === "restaurant"
                              ? row["restaurant"]["name"]
                              : row[column.id];
                          if (
                            column.id === "action" &&
                            userInfo.role === "owner" &&
                            !row.reply
                          )
                            return (
                              <React.Fragment key={column.id}>
                                <TableCell
                                  align={column.align}
                                  style={{ width: column.maxWidth }}
                                >
                                  <IconButton
                                    aria-label="reply"
                                    onClick={() => {
                                      setId(row.restaurant);
                                      setSelectedReview(row);
                                      setReplyModalOpen(true);
                                    }}
                                  >
                                    <ReplyIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </React.Fragment>
                            );
                          else if (column.id === "rate")
                            return (
                              <React.Fragment key={column.id}>
                                <TableCell
                                  align={column.align}
                                  style={{ width: column.maxWidth }}
                                >
                                  <Box
                                    mb={3}
                                    className={classes.boxMargin}
                                    borderColor="transparent"
                                  >
                                    <Rating
                                      name="read-only"
                                      value={value}
                                      precision={0.25}
                                      readOnly
                                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                    />
                                  </Box>
                                </TableCell>
                              </React.Fragment>
                            );
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ width: column.maxWidth }}
                            >
                              {column.id === "date"
                                ? moment(value).format("DD-MM-YYYY")
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50]}
              component="div"
              count={reviewCount}
              rowsPerPage={reviewParams.pageSize}
              page={reviewParams.page - 1}
              onChangePage={handleChangeReviewPage}
              onChangeRowsPerPage={handleChangeReviewLimitPage}
            />
          </Paper>
        )}
      </Container>
      <Confirm
        open={deleteOpen}
        confirmText="Do you want to remove this restaurant?"
        handleClose={() => setDeleteOpen(false)}
        handleSubmit={handleDeleteSubmit}
        selectedRow={selectedRow}
      />
      <ReplyModal
        id={id}
        setId={setId}
        open={replyOpen}
        handleClose={() => setReplyModalOpen(false)}
        selectRow={selectedReview}
      />
      <CreateRestaurant
        handleClose={() => setCreateOpen(false)}
        classes={classes}
        open={createOpen}
      />
      <UpdateRestaurant
        handleClose={() => setUpdateOpen(false)}
        classes={classes}
        open={updateOpen}
        selectedRow={selectedRow}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  params: state.restaurant.params,
  restaurants: state.restaurant.restaurants,
  restaurant: state.restaurant.currentRestaurant,
  userInfo: state.auth.me,
  count: state.restaurant.count,
  reviews: state.review.reviews,
  reviewCount: state.review.count,
  reviewParams: state.review.params,
  currentReview: state.review.currentReview
});

const mapDispatchToProps = {
  getRestaurants: restaurant.getRestaurants,
  getPendingReviews: review.getPendingReviews,
  createRestaurant: restaurant.createRestaurant,
  updateRestaurant: restaurant.updateRestaurant,
  deleteRestaurant: restaurant.deleteRestaurant,
  setParams: restaurant.setParams,
  setReviewParams: review.setParams,
  showToast: toast.showToast,
  setLoading: progress.setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
