import React, {useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import { AuthDispatch } from './App';


export default function PrivateRoute({component: Component, ...rest}) {

    const [authentication] = useContext(AuthDispatch);

    //console.log(authentication.auth.valueOf());

    return (
        <Route
            {...rest}
            render={props =>
                authentication.auth ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    );
}