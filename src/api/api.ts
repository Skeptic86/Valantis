import { md5 } from 'js-md5';
import axios, { AxiosError } from 'axios';
import { IBodyData } from '../pages/Home';

const getHeaders = () => {
    const date = new Date();
    date.setHours(date.getHours() - 2);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}0${month}${day}`;
    return {
        'X-Auth': md5(`Valantis_${currentDate}`),
    };
};

const axiosTemplate = axios.create({
    baseURL: '/api/',
    headers: {
        ...getHeaders(),
    },
});

axiosTemplate.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        //@ts-ignore
        if (error.response?.status !== 200 && error.config && !error.config._isRetry) {
            //@ts-ignore
            originalRequest._isRetry = true;
            try {
                //@ts-ignore
                return axiosTemplate.request(originalRequest);
            } catch (error) {
                console.error(error);
            }
        }
    },
);

export const productItemsDataAPI = {
    getProductItems: (body: IBodyData) => {
        return axiosTemplate.post('/', body);
    },
};
