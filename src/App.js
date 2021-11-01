import './styles/index.scss';
import React from "react";
import {HashRouter} from "react-router-dom";
// import {Router, Switch, Route} from "react-router-dom";
import MainRouter from "./MainRouter";
// import history from './utils/history';

function App() {
    return (
        <HashRouter basename={'/'}>
            <MainRouter/>
        </HashRouter>
        // <Router basename={`${process.env.PUBLIC_URL}/history`} history={history}>
        //     <Switch>
        //         <Route path="/" component={MainRouter}/>
        //     </Switch>
        // </Router>
    );
}

export default App;
