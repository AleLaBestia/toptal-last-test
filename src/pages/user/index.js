import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Container,
  Paper,
  Breadcrumbs,
  IconButton,
  Grid,
  Box
} from "@material-ui/core";
import {
  Group as GroupIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";

import UpdateUser from "components/UpdateUser";
import Confirm from "components/Confirm";
import StyledBreadcrumb from "components/StyledBreadcrumb";
import { user, progress, toast } from "redux/actions";

const columns = [
  { id: "no", numieric: false, disablePadding: true, label: "No" },
  {
    id: "Name",
    numeric: true,
    label: "Name",
    align: "center"
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
    align: "center"
  },
  { id: "role", disablePadding: false, label: "Role", align: "center" },
  { id: "action", disablePadding: false, label: "", align: "center" }
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
    marginTop: "1rem"
  },
  role: {
    width: "100%",
    marginTop: "1rem"
  },
  box: {
    display: "flex",
    justifyContent: "space-between"
  }
});

const User = props => {
  const classes = useStyles();
  const [selectedRow, setSelected] = useState("");
  const [role, setRole] = useState("");
  const [updateUserOpen, setUpdateUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const {
    getUsers,
    users = [],
    setParams,
    params,
    count,
    user,
    deleteUser,
    showToast
  } = props;

  useEffect(() => {
    getUsers({ params: { ...params, role } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, user, count, role]);

  const handleChangePage = (event, newPage) => {
    setParams({ page: newPage + 1 });
  };

  const handleChangeLimitPage = event => {
    setParams({ pageSize: event.target.value, page: 1 });
  };

  const handleDeleteSubmit = () => {
    setDeleteUserOpen(false);

    deleteUser({
      id: selectedRow._id,
      body: {},
      success: () => {
        showToast({
          message: "You successfully deleted selected user!",
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
        <Box className={classes.box} component="div">
          <Grid item xs={3}>
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              className={classes.crumbs}
            >
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Users"
                icon={<GroupIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </Grid>
        </Box>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map(column => {
                        const value =
                          column.id === "no"
                            ? (params.page - 1) * params.pageSize + index + 1
                            : column.id === "Name"
                            ? row["firstName"] + " " + row["lastName"]
                            : row[column.id];
                        if (column.id === "action") {
                          return (
                            <TableCell align={column.align} key={column.id}>
                              <IconButton
                                aria-label="details"
                                onClick={() => {
                                  setSelected(row);
                                  setUpdateUserOpen(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="details"
                                onClick={() => {
                                  setSelected(row);
                                  setDeleteUserOpen(true);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
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
        <UpdateUser
          open={updateUserOpen}
          handleClose={() => {
            setUpdateUserOpen(false);
          }}
          classes={classes}
          selectedRow={selectedRow}
        />
        <Confirm
          open={deleteUserOpen}
          confirmText="Do you want to remove this user?"
          handleClose={() => setDeleteUserOpen(false)}
          handleSubmit={handleDeleteSubmit}
          selectedRow={selectedRow}
        />
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  params: state.user.params,
  count: state.user.count,
  user: state.user.user
});

const mapDispatchToProps = {
  getUsers: user.getUsers,
  createUser: user.createUser,
  deleteUser: user.deleteUser,
  setParams: user.setParams,
  showToast: toast.showToast,
  setLoading: progress.setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
