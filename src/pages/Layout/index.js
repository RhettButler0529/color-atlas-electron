import React from 'react';
import Div100vh from 'react-div-100vh'

const Layout = (props) => {
    return (
        <Div100vh>
            {props.children}
        </Div100vh>
    );
}

export default Layout;
