import { useState, useEffect, FC, useCallback } from 'react';
import styles from './Home.module.scss';

import ProductItem from '../../components/ProductItem';
import { productItemsDataAPI } from '../../api/api';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import FilterInput from '../../components/FilterInput';
import debounce from 'lodash.debounce';
import FilterTags, { FilterEnum } from '../../components/FilterTags';
import { MAX_ELEMENTS_FOR_OFFSET } from '../../utils/consts/numberConsts';
import ProductItemsList from '../../components/ProductItemsList';

export interface IProduct {
    id: number;
    product: string;
    price: number;
    brand: string;
}

enum ActionEnum {
    GET_IDS = 'get_ids',
    FILTER = 'filter',
    GET_FIELDS = 'get_fields',
    GET_ITEMS = 'get_items',
}

export interface IBodyData {
    action: ActionEnum;
    params: {
        offset?: number;
        limit?: number;
        ids?: string[];
        field?: string;
        filter?: FilterEnum;
    };
}

const Home: FC = () => {
    const [currentProductItems, setCurrentProductItems] = useState<IProduct[]>([]); //Вынести в отдельный компонент ListProducts
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [input, setInput] = useState('');

    const [selectedFilter, setSelectedFilter] = useState<FilterEnum>(FilterEnum.NULL);

    const handleChangeFilter = (filter: FilterEnum) => {
        if (filter !== selectedFilter) {
            setSelectedFilter(filter);
            if (input.length > 0) {
                testReq(offset, input, filter);
                setOffset(0);
            }
        }
    };

    const moveToNextPage = () => {
        if (offset <= MAX_ELEMENTS_FOR_OFFSET) {
            testReq(offset, input, selectedFilter);
            setOffset((prev) => prev + 50);
            window.scrollTo(0, 0);
        }
    };

    const moveToPrevPage = () => {
        if (offset !== 0) {
            testReq(offset, input, selectedFilter);
            setOffset((prev) => prev - 50);
            window.scrollTo(0, 0);
        }
    };

    const getReqBody = (offset: number, input: string, filter: FilterEnum): IBodyData => {
        if (filter !== FilterEnum.NULL && input.length > 0) {
            let currentInput: string | number = input;
            if (filter === FilterEnum.PRICE) {
                currentInput = parseInt(input, 10);
            }
            return {
                action: ActionEnum.FILTER,
                params: { [filter]: currentInput, limit: 50, offset },
            };
        } else {
            return {
                action: ActionEnum.GET_IDS,
                params: { offset, limit: 50 },
            };
        }
    };

    const testReq = async (offset: number, input: string, filter: FilterEnum) => {
        const reqBody = getReqBody(offset, input, filter);
        setIsLoading(true);
        try {
            const { data } = await productItemsDataAPI.getProductItems(reqBody);

            const reqBodyItems: IBodyData = {
                action: ActionEnum.GET_ITEMS,
                params: { ids: data.result },
            };

            const response = await productItemsDataAPI.getProductItems(reqBodyItems);

            const responseCurrentItems: IProduct[] = response.data.result;
            const uniqueItemsMap = new Map<number, IProduct>();

            responseCurrentItems.forEach((item) => {
                if (!uniqueItemsMap.has(item.id)) {
                    uniqueItemsMap.set(item.id, item);
                }
            });

            const uniqueProductItems = Array.from(uniqueItemsMap.values());

            //Проверка на случай если action=filter и ограничить число элементов на странице, ибо в апи не предусмотрено offset и limit для filter.
            //Есть вариант создавать еще state для пришедших данных для фильтра и переделать пагинацию под него, но тогда нет смысла использовать offset и limit для get_ids

            if (uniqueProductItems.length <= 50) {
                setCurrentProductItems(uniqueProductItems);
            } else {
                const slicedUniqueItems = uniqueProductItems.slice(0, 49);
                setCurrentProductItems(slicedUniqueItems);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedChangeInput = useCallback(debounce(testReq, 1200), []);

    const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedChangeInput(offset, event.target.value, selectedFilter);
        setInput(event.target.value);
        setOffset(0);
    };

    useEffect(() => {
        testReq(offset, input, FilterEnum.NULL);
    }, []);

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <h1 className={styles.header}>Магазин Valantis</h1>
                <div className={styles.filter_wrapper}>
                    <FilterInput
                        filter={selectedFilter}
                        value={input}
                        onChangeInput={changeInput}
                    />
                    <FilterTags activeTag={selectedFilter} onChangeTag={handleChangeFilter} />
                </div>
                <div className={styles.content_items}>
                    {isLoading ? (
                        <div className={styles.loader_container}>
                            <Loader />
                        </div>
                    ) : (
                        <ProductItemsList currentProductItems={currentProductItems} />
                    )}
                </div>
                <div className={styles.pagination}>
                    {!isLoading && (
                        <Pagination prev={moveToPrevPage} next={moveToNextPage} offset={offset} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
