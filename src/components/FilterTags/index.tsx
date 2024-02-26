import { FC } from 'react';
import styles from './FilterTags.module.scss';

export enum FilterEnum {
    BRAND = 'brand',
    PRICE = 'price',
    PRODUCT = 'product',
    NULL = '',
}

interface ITag {
    name: FilterEnum;
    label: string;
}

const tags: ITag[] = [
    {
        name: FilterEnum.PRICE,
        label: 'Цена',
    },
    {
        name: FilterEnum.BRAND,
        label: 'Бренд',
    },
    {
        name: FilterEnum.PRODUCT,
        label: 'Название',
    },
];

interface IFilterTagsProps {
    activeTag: string;
    onChangeTag: (tag: FilterEnum) => void;
}

const FilterTags: FC<IFilterTagsProps> = ({ activeTag, onChangeTag }) => {
    return (
        <>
            <div className={styles.wrapper_outer}>
                <h3>Фильтр по</h3>
                <div className={styles.wrapper_inner}>
                    {tags.map((tag) => (
                        <div
                            onClick={() => onChangeTag(tag.name)}
                            className={`${styles.tag} ${
                                activeTag === tag.name ? styles.active : ''
                            }`}
                            key={tag.name}>
                            {tag.label}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FilterTags;
