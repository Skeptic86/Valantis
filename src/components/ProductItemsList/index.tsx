import { FC } from 'react';
import { IProduct } from '../../pages/Home';
import ProductItem from '../ProductItem';
import styles from './ProductItemsList.module.scss';

interface IProductItemsListProps {
    currentProductItems: IProduct[];
}

const ProductItemsList: FC<IProductItemsListProps> = ({ currentProductItems }) => {
    const showedProducts = currentProductItems.map((productItem: IProduct) => (
        <ProductItem key={productItem.id} {...productItem} />
    ));

    return (
        <div className={styles.content_items__inner}>
            {showedProducts.length > 0 ? (
                showedProducts
            ) : (
                <h2 className={styles.header_none}>
                    К сожалению товара соответсвующего данным фильтрам нет в магазине
                </h2>
            )}
        </div>
    );
};

export default ProductItemsList;
