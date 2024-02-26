import { FC } from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import styles from './Pagination.module.scss';

interface IPaginationProps {
    next: () => void;
    prev: () => void;
    offset: number;
}

const MAX_ELEMENTS = 8004;

const Pagination: FC<IPaginationProps> = ({ next, prev, offset }) => {
    return (
        <div className={styles.wrapper}>
            <FaArrowCircleLeft
                onClick={prev}
                size={48}
                className={offset === 0 ? styles.disabled : styles.enabled}
            />
            <FaArrowCircleRight
                onClick={next}
                size={48}
                className={offset > MAX_ELEMENTS ? styles.disabled : styles.enabled}
            />
        </div>
    );
};

export default Pagination;
