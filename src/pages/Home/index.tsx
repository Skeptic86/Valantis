import { useState, useEffect, FC } from 'react';
import styles from './Home.module.scss';

import Item from '../../components/Item';
import { itemsDataAPI } from '../../api/api';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

interface IProduct {
    id: number;
    product: string;
    price: number;
    brand: string;
}

interface IReqData {
    result: string[] | IProduct[];
}

export interface IBodyData {
    action: 'get_ids' | 'filter' | 'get_fields' | 'get_items' | 'test';
    params: {
        offset?: number;
        limit?: number;
        ids?: string[];
        field?: string;
        price?: number;
        brand?: string;
    };
}

const Home: FC = () => {
    const [currentItems, setCurrentItems] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);

    const nextPage = () => {
        console.log('next working');
        setOffset((prev) => prev + 50);
    };

    const prevPage = () => {
        console.log('prev working');
        if (offset !== 0) {
            setOffset((prev) => prev - 50);
        }
    };

    const reqBody: IBodyData = {
        action: 'get_ids',
        params: { offset, limit: 50 },
    };

    const testReq = async () => {
        try {
            const { data } = await itemsDataAPI.getItems(reqBody);

            const reqBodyItems: IBodyData = {
                action: 'get_items',
                params: { ids: data.result },
            };

            const response = await itemsDataAPI.getItems(reqBodyItems);

            const responseCurrentItems: IProduct[] = response.data.result as IProduct[];
            const uniqueItemsMap = new Map<number, IProduct>();

            responseCurrentItems.forEach((item) => {
                if (!uniqueItemsMap.has(item.id)) {
                    uniqueItemsMap.set(item.id, item);
                }
            });

            const uniqueItems = Array.from(uniqueItemsMap.values());

            setCurrentItems(uniqueItems);
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        testReq();
        console.log(currentItems);
    }, [offset]);

    const items_fc = currentItems.map((item: IProduct) => <Item key={item.id} {...item} />);

    return (
        <>
            <div className="container">
                <div className={styles.wrapper}>
                    <h1 className={styles.header}>Магазин</h1>
                    <div className={styles.content_items}>
                        {isLoading ? (
                            <div className={styles.loader_container}>
                                <Loader />
                            </div>
                        ) : items_fc.length > 0 ? (
                            items_fc
                        ) : (
                            <h2 className={styles.header_none}>
                                К сожалению товара соответсвующего данным фильтрам нет в магазине
                            </h2>
                        )}
                    </div>
                    {!isLoading && <Pagination prev={prevPage} next={nextPage} />}
                </div>
            </div>
        </>
    );
};

export default Home;
