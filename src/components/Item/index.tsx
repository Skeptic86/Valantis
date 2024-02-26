import React from 'react';
import styles from './Item.module.scss';
import logo from '../../assets/product.png';

export type TItemProps = {
    id: number;
    product: string;
    price: number;
    brand: string;
};

const Item: React.FC<TItemProps> = ({ id, product, price, brand }) => {
    return (
        <div className={styles.item_wrapper}>
            <div className={styles.item}>
                <img className={styles.item_image} src={logo} alt={`item ${id}`} />
                <h4 className={styles.item_title}>{product}</h4>
                <p className={styles.item_price}>{`Цена: ${price}₽`}</p>
                <p className={styles.item_brand}>{`${brand ? `Бренд: ${brand}` : ''}`}</p>
            </div>
        </div>
    );
};

export default Item;
