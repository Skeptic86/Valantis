import React, { useState } from 'react';
import styles from './Home.module.scss';
import axios from 'axios';
import { md5 } from 'js-md5';

import items from '../../assets/items.json';
import Item from '../../components/Item';
import { TItemProps } from '../../components/Item';

interface IProduct {
    id: number;
    name: string;
    price: number;
    brand: string;
}

interface IReqData {
    result: string[] | IProduct[];
}

const Home: React.FC = () => {
    const [currentItems, setCurrentItems] = useState<IProduct[]>([]);

    const getHeaders = () => {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}0${month}${day}`;
        return {
            'X-Auth': md5(`Valantis_${currentDate}`),
        };
    };

    const reqBody = {
        action: 'get_ids',
        params: { offset: 0, limit: 50 },
    };

    const testReq = async () => {
        const { data } = await axios.post<IReqData>('http://api.valantis.store:40000/', reqBody, {
            headers: getHeaders(),
        });

        const reqBodyItems = {
            action: 'get_items',
            params: { ids: data.result },
        };

        const response = await axios.post<IReqData>(
            'http://api.valantis.store:40000/',
            reqBodyItems,
            {
                headers: getHeaders(),
            },
        );

        const responseCurrentItems: IProduct[] = response.data.result as IProduct[];
        const uniqueItemsMap = new Map<number, IProduct>();

        responseCurrentItems.forEach((item) => {
            if (!uniqueItemsMap.has(item.id)) {
                uniqueItemsMap.set(item.id, item);
            }
        });

        const uniqueItems = Array.from(uniqueItemsMap.values());

        setCurrentItems(uniqueItems);
    };

    const items_fc = currentItems.map((item: IProduct) => <Item key={item.id} {...item} />);

    return (
        <>
            <div className="container">
                <div className={styles.wrapper}>
                    <h1 className={styles.header}>Магазин</h1>
                    <button onClick={testReq}>тык</button>
                    <div className={styles.content_items}>{items_fc}</div>
                </div>
            </div>
        </>
    );
};

export default Home;
