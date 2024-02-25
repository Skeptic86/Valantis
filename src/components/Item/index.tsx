import React from 'react';
import styles from './Item.module.scss';

export type TItemProps = {
    id: number;
    name: string;
    price: number;
    brand: string;
};

const Item: React.FC<TItemProps> = ({ id, name, price, brand }) => {
    return (
        <div className={styles.item_wrapper}>
            <div className={styles.item}>
                <img
                    className={styles.item_image}
                    src="https://dodopizza.azureedge.net/static/Img/Products/f035c7f46c0844069722f2bb3ee9f113_584x584.jpeg"
                    alt={`item ${id}`}
                />
                <h4 className={styles.item_title}>{name}</h4>
                <p className={styles.item_price}>{`Цена: ${price}₽`}</p>
                <p className={styles.item_brand}>{`${brand ? `Бренд: ${brand}` : ''}`}</p>
            </div>
        </div>
    );
};

export default Item;
