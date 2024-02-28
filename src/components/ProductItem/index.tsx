import React from 'react';
import styles from './ProductItem.module.scss';
import logo from '../../assets/product.png';

export interface IProductItemProps {
    id: number;
    product: string;
    price: number;
    brand: string;
}

const ProductItem: React.FC<IProductItemProps> = ({ id, product, price, brand }) => (
    <div className={styles.item_wrapper}>
        <div className={styles.item}>
            <img className={styles.item_image} src={logo} alt={`Изображение ${product}`} />
            <h4 className={styles.item_title}>{product}</h4>
            <p className={styles.item_price}>{`Цена: ${price}₽`}</p>
            <p className={styles.item_brand}>{`${brand ? `Бренд: ${brand}` : ''}`}</p>
            <p className={styles.item_id}>{`ID: ${id}`}</p>
        </div>
    </div>
);

export default ProductItem;
