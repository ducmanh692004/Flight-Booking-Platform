import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSelector } from 'react-redux';

dayjs.extend(utc);
dayjs.extend(timezone);

export const useFormatter = () => {
    const language = useSelector((state) => state.language.current_language);

    const formatCurrency = (value) => {
        if (language === 'vi') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
            }).format(value);
        } else {
            const exchangeRate = 25000;
            const usdAmount = value / exchangeRate;

            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            }).format(usdAmount);
        }
    };

    return { formatCurrency };
    // return { formatCurrency };
};
