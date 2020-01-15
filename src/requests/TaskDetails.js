import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {makeStyles, lighten, withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import axios from "axios";
import {ListItemText} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import {AuthDispatch} from "../App";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        //width: '100%',
        //display: 'flex',
        //maxWidth: 420,
        //alignItems: 'center',
        //flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //maxWidth: 420
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    progress: {
        margin: theme.spacing(2),
    },
    list: {
        width: '100%',
        maxWidth: 400,
    },
    inline: {
        display: 'inline',
    },
    margin: {
        margin: theme.spacing(1),
    }
}));


export default function TaskDetails() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [notes, setNotes] = useState([]);
    const [authentication] = useContext(AuthDispatch);
    const [active, setActive] = useState(false);
    const [logs, setLogs] = useState([]);
    const GET_HEADERS_URL = process.env.NODE_ENV !== "production" ?
        'http://localhost:2010/crit/bridgedeck/getTicketLibs/' :
        'http://192.168.200.189:2010/crit/bridgedeck/getTicketLibs/';

    const ADD_LIB_URL = process.env.NODE_ENV !== "production" ?
        'http://localhost:2010/crit/bridgedeck/addlib' :
        'http://192.168.200.189:2010/crit/bridgedeck/addlib';

    let { id } = useParams();

    const addLog = (libId, info) => async event => {
        //const info = libId === -2.54 ? "Started" : "Ended";
        await axios.post(ADD_LIB_URL, {
            reqId: id,
            libId: libId,
            info: info
        }, {
            headers: {
                "Accept": "application/json",
                "token": authentication.token
            }
        })
            .then((result) => {
                console.dir(result.data);

            })
            .catch((error) => {
                //setIsError(true);
                console.log(error);
            });
    };

    const checkLogs = (logs) => {
        if (logs.size > 0) {
            const currentUserLogs = logs.filter(log => log.username === authentication.username)
                .sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                });
            console.log(currentUserLogs);
            if (currentUserLogs[0].id === -2.54) {
                setActive(true);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await axios.get(GET_HEADERS_URL.concat(id), {
                headers: {
                    "Accept": "application/json",
                    "token": authentication.token
                }
            })
                .then((result) => {
                    console.dir(result.data);
                    console.dir(result.data.ticketCharacteristic);
                    setData(result.data.ticketCharacteristic);
                    setNotes(result.data.notes);
                    setLogs(result.data.relatedPartyList);
                    checkLogs(result.data.relatedPartyList);
                    setIsLoading(false);
                })
                .catch((error) => {
                    //setIsError(true);
                    console.log(error);
                });

        };

        fetchData();
    }, [GET_HEADERS_URL, authentication.token, id]);

    return (
        <Container component="main" maxWidth="lg">
            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5" align={"center"}>
                            Actions:
                        </Typography>
                        {active ? (
                                <Button variant="contained" color="secondary" className={classes.margin} onClick={addLog(-2.55, "Ended")}>
                                    Stop
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" className={classes.margin} onClick={addLog(-2.54, "Started")}>
                                    Start
                                </Button>
                            )
                        }
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <List className={classes.list}>
                                {logs.map(log => (
                                    <ListItem key={log.date.concat(log.info)} divider={true}>
                                        <ListItemText
                                            primary={log.username.concat(" - ").concat(log.info)}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        {log.date.substring(0, 19).replace("T", " ")}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5" align={"center"}>
                            Request: {id}
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <List className={classes.list}>
                                {data.map(field => (
                                    <ListItem key={field.name} divider={true}>
                                        <ListItemText>
                                            {field.name}:
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            {field.value}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5" align={"center"}>
                            Comments:
                        </Typography>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <List className={classes.list}>
                                {notes.map(note => (
                                    <ListItem key={note.date.concat(note.text)} divider={true}>
                                        <ListItemText
                                            primary={note.username.concat(" - ").concat(note.date.substring(0, 19).replace("T", " "))}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        {note.text}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}