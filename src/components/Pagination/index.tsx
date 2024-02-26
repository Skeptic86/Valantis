import { FC } from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import styles from './Pagination.module.scss';

type TPaginationProps = {
    next: () => void;
    prev: () => void;
};

const Pagination: FC<TPaginationProps> = ({ next, prev }) => {
    return (
        <div className={styles.wrapper}>
            <FaArrowCircleLeft onClick={prev} size={48} />
            <FaArrowCircleRight onClick={next} size={48} />
        </div>
    );
};

export default Pagination;
