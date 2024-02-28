import { FC } from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { DEFAULT_SIZE_ICON, MAX_ELEMENTS_FOR_OFFSET } from '../../utils/consts/numberConsts';
import styles from './Pagination.module.scss';

interface IPaginationProps {
    next: () => void;
    prev: () => void;
    offset: number;
}

const Pagination: FC<IPaginationProps> = ({ next, prev, offset }) => (
    <div className={styles.wrapper}>
        <FaArrowCircleLeft
            onClick={prev}
            size={DEFAULT_SIZE_ICON}
            className={offset === 0 ? styles.disabled : styles.enabled}
        />
        <FaArrowCircleRight
            onClick={next}
            size={DEFAULT_SIZE_ICON}
            className={offset > MAX_ELEMENTS_FOR_OFFSET ? styles.disabled : styles.enabled}
        />
    </div>
);

export default Pagination;
