import React from 'react';

import burderLogo from '../../assets/images/burger-logo.png'
import classes from './Logo.css'

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={burderLogo} alt='MyBurger'/>
    </div>
);

export default logo;