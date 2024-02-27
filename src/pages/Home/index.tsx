// добавить лимит и офсет в action: "filter";
// избавиться от лишних запросов. Сравнивать предыдущий action? если разные, делать запрос и сбрасывать фильтр?
import { useState, useEffect, FC, useCallback } from 'react';
import styles from './Home.module.scss';

import Item from '../../components/Item';
import { itemsDataAPI } from '../../api/api';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import FilterInput from '../../components/FilterInput';
import debounce from 'lodash.debounce';
import FilterTags, { FilterEnum } from '../../components/FilterTags';

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
        filter?: FilterEnum;
    };
}

const Home: FC = () => {
    const [currentItems, setCurrentItems] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [input, setInput] = useState('');

    const [filter, setFilter] = useState<FilterEnum>(FilterEnum.NULL);

    const onChangeFilter = (_filter: FilterEnum) => {
        setFilter(_filter);
        if (input.length > 0) {
            testReq(offset, input, _filter);
            setOffset(0);
        }
    };

    const nextPage = () => {
        if (offset <= 8004) {
            testReq(offset, input, filter);
            setOffset((prev) => prev + 50);
            window.scrollTo(0, 0);
        }
    };

    const prevPage = () => {
        if (offset !== 0) {
            testReq(offset, input, filter);
            setOffset((prev) => prev - 50);
            window.scrollTo(0, 0);
        }
    };

    const getReqBody = (offset: number, input: string, filter: FilterEnum): IBodyData => {
        console.log('reqBodyFilter:  ', filter);
        console.log('reqBody input.length:  ', input.length);
        if (filter !== FilterEnum.NULL && input.length > 0) {
            let currentInput: string | number = input;
            if (filter === FilterEnum.PRICE) {
                currentInput = Number(input);
            }
            console.log('inside filter');
            console.log('offset inside filter:', offset);
            return {
                action: 'filter',
                params: { [filter]: currentInput, limit: 50, offset },
            };
        } else {
            console.log('inside get_ids');
            return {
                action: 'get_ids',
                params: { offset, limit: 50 },
            };
        }
    };

    const testReq = async (offset: number, input: string, filter: FilterEnum) => {
        const reqBody = getReqBody(offset, input, filter);
        setIsLoading(true);
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

            if (uniqueItems.length <= 50) {
                setCurrentItems(uniqueItems);
            } else {
                const slicedUniqueItems = uniqueItems.slice(0, 49);
                setCurrentItems(slicedUniqueItems);
            }
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
            } else {
                console.log('Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedChangeInput = useCallback(debounce(testReq, 1200), []);

    const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedChangeInput(offset, event.target.value, filter);
        setInput(event.target.value);
        setOffset(0);
    };

    useEffect(() => {
        testReq(offset, input, FilterEnum.NULL);
    }, []);

    useEffect(() => {
        console.log('offset', offset);
    }, [offset]);

    const items_fc = currentItems.map((item: IProduct) => <Item key={item.id} {...item} />);

    return (
        <>
            <div className="container">
                <div className={styles.wrapper}>
                    <h1 className={styles.header}>Магазин</h1>
                    <div className={styles.filter_wrapper}>
                        <FilterInput filter={filter} value={input} onChangeInput={changeInput} />
                        <FilterTags activeTag={filter} onChangeTag={onChangeFilter} />
                    </div>
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
                    <div className={styles.pagination}>
                        {!isLoading && (
                            <Pagination prev={prevPage} next={nextPage} offset={offset} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
