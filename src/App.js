import React, {useReducer, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {BrowserRouter as Router, Route} from "react-router-dom";
import SignIn from "./LoginPage";
import PrivateRoute from "./PrivateRoute";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Snackbar from "@material-ui/core/Snackbar";
import TaskList from "./requests/TaskList";
import TaskDetails from "./requests/TaskDetails";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  appName: {
    flex: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


const routes = [
  {
    path: "/",
    exact: true,
    main: TaskList
  },
  {
    path: "/tasklist",
    main: TaskList
  },
  {
    path: "/taskdetails/:id",
    main: TaskDetails
  }
];

export const AuthDispatch = React.createContext(null);

const App = (props) => {
  const [snack, setSnack] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const DEV_MODE = process.env.NODE_ENV !== "production" ? '{dev mode}' : '';

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeAuth':
        return {
          ...state,
          auth: action.payload
        };
      case 'token':
        return {
          ...state,
          token: action.payload
        };
      case 'fullName':
        return {
          ...state,
          fullName: action.payload
        };
      case 'username':
        return {
          ...state,
          fullName: action.payload
        };
      default:
        return state;
    }
  };

  const localState = {
    auth: JSON.parse(localStorage.getItem("auth")),
    token: JSON.parse(localStorage.getItem("token")),
    fullName: JSON.parse(localStorage.getItem("fullName")),
    username: JSON.parse(localStorage.getItem("username"))
  };

  const initialAuth = {
    auth: false,
    token: '',
    fullName: '',
    username: ''
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack(false);
  };

  const handleSnack = () => {
    setSnack(true);
  };

  const [authentication, authDispatch] = useReducer(reducer, localState || initialAuth);

  return (
      <div className={classes.root}>
        <AuthDispatch.Provider value={[authentication, authDispatch]}>
          <Router>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" noWrap className={classes.appName}>
                  Bridge {DEV_MODE}
                </Typography>
                <Typography variant="h6" className={classes.title}>
                  {authentication.fullName}
                </Typography>
              </Toolbar>
            </AppBar>

            <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
              <div className={classes.toolbar}/>
              <Route path="/login" component={SignIn}/>
              {routes.map((route, index) => (
                  // Render more <Route>s with the same paths as
                  // above, but different components this time.
                  <PrivateRoute
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      component={route.main}
                  />
              ))}
            </main>

            <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={snack}
                onClose={handleClose}
                autoHideDuration={5000}
                //TransitionComponent={SlideTransition}
                ContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Login successful</span>}
                action={[
                  <Button key="undo" color="secondary" size="small" onClick={handleClose}>
                    UNDO
                  </Button>,
                  <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      className={classes.close}
                      onClick={handleClose}
                  >
                    <CloseIcon/>
                  </IconButton>,
                ]}
            />
          </Router>
        </AuthDispatch.Provider>
      </div>
  );
};

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};

export default App;
