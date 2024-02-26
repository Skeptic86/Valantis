import React from 'react';
import { FilterEnum } from '../FilterTags';
import styles from './FilterInput.module.scss';

interface IFilterInputProps {
    value: string;
    filter: FilterEnum;
    onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const filterPlaceholders = {
    [FilterEnum.PRICE]: 'цену',
    [FilterEnum.BRAND]: 'бренд',
    [FilterEnum.PRODUCT]: 'название',
    [FilterEnum.NULL]: '',
};

const FilterInput: React.FC<IFilterInputProps> = ({ value, filter, onChangeInput }) => {
    const isFilterNull = filter === FilterEnum.NULL;

    return (
        <input
            disabled={isFilterNull}
            type="text"
            placeholder={
                isFilterNull
                    ? 'Выберите фильтр для поиска'
                    : `Введите ${filterPlaceholders[filter]} продукта`
            }
            value={value}
            onChange={onChangeInput}
            className={styles.input}
        />
    );
};

export default FilterInput;
