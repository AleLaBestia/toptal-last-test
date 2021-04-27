import React from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Formik } from "formik";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  InputAdornment,
  Typography,
  Container,
  Box,
  Card,
} from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import * as Yup from "yup";

import { auth, toast } from "redux/actions";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: "red",
    textAlign: "left",
  },
  role: {
    width: "100%",
  },
  root: {
    display: "flex",
    height: "100%",
  },
  card: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    marginTop: "200px",
  },
  container: {
    display: "flex",
    width: "50%",
  },
  background: {
    width: "50%",
    height: "100%",
    backgroundImage: `url("/restaurant.jpg")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  role: "",
};

const validation = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name."),
  lastName: Yup.string().required("Please enter your last name."),
  email: Yup.string()
    .required("Please enter your email.")
    .email("Invalid email."),
  password: Yup.string()
    .required("Please enter your password.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  passwordConfirm: Yup.string()
    .required("Please enter your confirm password.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Password should be matched."
      ),
    }),
  role: Yup.string().required("Please select the role."),
});

const SignUp = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { signup, showToast } = props;

  const handleSubmit = (values, actions) => {
    signup({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        history.push("/login");
        showToast({
          message: "You are successfully signed up!",
          intent: "success",
          timeout: 3000,
        });
      },
      fail: (err) => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data.message,
          intent: "error",
        });
      },
    });
  };

  return (
    <Box className={classes.root} component="div">
      <Container className={classes.container} component="main" maxWidth="sm">
        <CssBaseline />
        <Card className={classes.card} raised>
          <Avatar className={classes.avatar}>
            <RestaurantIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            SIGN UP
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validation}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form className={classes.form} onSubmit={props.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      fullWidth
                      id="firstName"
                      label="First Name"
                      value={props.values.firstName}
                      onChange={props.handleChange}
                      error={props.errors.firstName && props.touched.firstName}
                      helperText={
                        props.errors.firstName &&
                        props.touched.firstName &&
                        props.errors.firstName
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={props.values.lastName}
                      onChange={props.handleChange}
                      error={props.errors.lastName && props.touched.lastName}
                      helperText={
                        props.errors.lastName &&
                        props.touched.lastName &&
                        props.errors.lastName
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="lname"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      value={props.values.email}
                      error={props.errors.email && props.touched.email}
                      helperText={
                        props.errors.email &&
                        props.touched.email &&
                        props.errors.email
                      }
                      onChange={props.handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="email"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="role"
                      name="role"
                      fullWidth
                      select
                      label="Role"
                      className={classes.role}
                      value={props.values.role}
                      onChange={props.handleChange}
                      SelectProps={{
                        native: true,
                      }}
                      error={props.errors.role && props.touched.role}
                      helperText={
                        props.errors.role &&
                        props.touched.role &&
                        props.errors.role
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmojiPeopleIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      <option value="regular">Regular</option>
                      <option value="owner">Owner</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={props.values.password}
                      error={props.errors.password && props.touched.password}
                      helperText={
                        props.errors.password &&
                        props.touched.password &&
                        props.errors.password
                      }
                      onChange={props.handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="current-password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="passwordConfirm"
                      label="Confirm Password"
                      type="password"
                      id="passwordConfirm"
                      error={
                        props.errors.passwordConfirm &&
                        props.touched.passwordConfirm
                      }
                      helperText={
                        props.errors.passwordConfirm &&
                        props.touched.passwordConfirm &&
                        props.errors.passwordConfirm
                      }
                      value={props.values.passwordConfirm}
                      onChange={props.handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="current-password"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!props.isValid}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link to="/login" variant="body2">
                      {"Back to Log in"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Card>
      </Container>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  signup: auth.signup,
  showToast: toast.showToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
