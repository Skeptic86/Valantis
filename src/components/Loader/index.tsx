import React from 'react';
import { AMOUNT_OF_DOTS_IN_LODAER } from '../../utils/consts/numberConsts';
import styles from './Loader.module.scss';

const Loader = () => (
    <div className={styles.lds_roller}>
        {new Array(AMOUNT_OF_DOTS_IN_LODAER).fill(0).map((_, index) => (
            <div key={index} />
        ))}
    </div>
);

export default Loader;
