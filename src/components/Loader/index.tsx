import React from 'react';
import styles from './Loader.module.scss';

const Loader = () => {
    return (
        <div className={styles.lds_roller}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Loader;
