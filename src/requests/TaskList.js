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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import {AuthDispatch} from "../App";
import {Link, useHistory} from "react-router-dom";

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
        maxWidth: 360,
    },
    tablerow: {
        textDecoration: 'none'
    }
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);


function TaskList() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [authentication] = useContext(AuthDispatch);
    const GET_HEADERS_URL = process.env.NODE_ENV !== "production" ?
        'http://localhost:2010/crit/bridgedeck/getticketheaders' :
        'http://192.168.200.189:2010/crit/bridgedeck/getticketheaders';

    let history = useHistory();


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await axios.get(GET_HEADERS_URL, {
                headers: {
                    "Accept": "application/json",
                    "token": authentication.token
                }
            })
                .then((result) => {
                    console.dir(result.data);
                    setData(result.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    //setIsError(true);
                    console.log(error);
                });

        };

        fetchData();
    }, [GET_HEADERS_URL, authentication.token]);

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    List of requests
                </Typography>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Request Type</StyledTableCell>
                                <StyledTableCell align="left">Request ID</StyledTableCell>
                                <StyledTableCell align="right">Insert date</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(row => (
                                <TableRow hover key={row.reqId} onClick={() => history.push("/requestdetails/".concat(row.reqId))}>
                                    <TableCell>
                                        {row.reqType}
                                    </TableCell>
                                    <TableCell align="left">{row.reqId}</TableCell>
                                    <TableCell align="right">{row.insertDate.replace("T", " ")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
                }
            </div>
        </Container>
    );
}

export default TaskList;

class Header {
    constructor(reqId, reqType, insertDate) {
        this.reqId = reqId;
        this.reqType = reqType;
        this.date = insertDate;
    }
}