import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import HomePage from "./pages/HomePage";

const MainRouter = () => {
    return (
        <Switch>
            <Redirect
                exact
                from={`/`}
                to={`/home`}
            />
            <Route
                exact
                path={`/home`}
                component={HomePage}
            />
        </Switch>
    );
}

export default MainRouter;
