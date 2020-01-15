import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { AuthDispatch } from './App';
import { Redirect } from "react-router-dom";
import axios from "axios";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.orange.md/">
                Orange
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    close: {
        padding: theme.spacing(0.5),
    },
}));


export default function SignIn(props) {
    const classes = useStyles();
    const [ authentication, dispatch ] = React.useContext(AuthDispatch);
    //const [ token, setToken ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ username, setUsername] = useState('');
    const [ pass, setPass] = useState('');
    const LOGIN_URL = process.env.NODE_ENV !== "production" ? 'http://localhost:2010/crit/bridgedeck/login' :
        'http://192.168.200.189:2010/crit/bridgedeck/login';

    const fetchData = async (cred) => {
        setIsError(false);
        setIsLoading(true);

        axios.post(LOGIN_URL, {
            userName: cred.username.toUpperCase(),
            password: cred.password
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.token !== null) {
                    // Save auth data to localStorage so the user remain authenticated after page refresh
                    localStorage.setItem("token", JSON.stringify(response.data.token));
                    localStorage.setItem("auth", JSON.stringify(true));
                    localStorage.setItem("fullName", JSON.stringify(response.data.fullName));
                    localStorage.setItem("username", JSON.stringify(username));

                    // Save auth data to Context
                    dispatch({type: 'token', payload: response.data.token});
                    dispatch({type: 'changeAuth', payload: true});
                    dispatch({type: 'fullName', payload: response.data.fullName});
                    dispatch({type: 'username', username});
                }
            })
            .catch((error) => {
                setIsError(true);
                console.log(error);
            });

        setIsLoading(false);
    };

    let from = props.location.state.from;

    if (authentication.auth) return <Redirect to={from.pathname} />;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={ classes.form } noValidate
                      onSubmit={ event => {
                          //console.log('clicked');
                          fetchData({username: username, password: pass});
                        event.preventDefault();
                      }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={event => setUsername(event.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={event => setPass(event.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="https://isimsrv.orange.md:9082/itim/ui/Login.jsp" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>

        </Container>
    );
}