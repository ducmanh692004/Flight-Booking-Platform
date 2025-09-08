const dayjs = require('dayjs');

const parseDate = (rawDate) => {
    const date = new Date(rawDate); // Ép kiểu từ string sang Date
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
};

const formatPriceVND = (price) => {
    return price.toLocaleString('vi-VN');
};

const getHourMinute = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getFlightDuration = (departureTimeISO, arrivalTimeISO) => {
    const departure = new Date(departureTimeISO);
    const arrival = new Date(arrivalTimeISO);

    const diffMs = arrival - departure;

    if (diffMs <= 0) return 'Thời gian không hợp lệ';

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
};

const getDateOnly = (isoString) => {
    return isoString.split('T')[0];
};

const getDuration = (flight) => {
    const start = new Date(flight.departure_time);
    const end = new Date(flight.arrival_time);
    return end - start;
};

const checkTimeWithTimezone = (timeUTC, timeFilter, timezone) => {
    const localHour = dayjs.utc(timeUTC).tz(timezone).hour();

    let start = 0;
    let end = 0;

    if (timeFilter === 'night_morning') {
        start = 0;
        end = 6;
    } else if (timeFilter === 'morning_noon') {
        start = 6;
        end = 12;
    } else if (timeFilter === 'noon_evening') {
        start = 12;
        end = 18;
    } else if (timeFilter === 'evening_night') {
        start = 18;
        end = 24;
    } else {
        return false;
    }

    return localHour >= start && localHour < end;
};

const calculaterPriceFlightRoundTrip = (cartItem) => {
    return (
        (Number(
            cartItem.dataFlightDeparture.seats_quantity[0].price
                ?.$numberDecimal || 0
        ) +
            Number(
                cartItem.dataFlightComeback.seats_quantity[0].price
                    ?.$numberDecimal || 0
            )) *
            cartItem.peopleQuantity.adult +
        (Number(
            cartItem.dataFlightDeparture.seats_quantity[0].child_price
                ?.$numberDecimal || 0
        ) +
            Number(
                cartItem.dataFlightComeback.seats_quantity[0].child_price
                    ?.$numberDecimal || 0
            )) *
            cartItem.peopleQuantity.child
    );
};

const calculaterPriceFlightOneWay = (cartItem) => {
    return (
        Number(
            cartItem.dataFlightDeparture?.seats_quantity?.[0]?.price
                ?.$numberDecimal || 0
        ) *
            cartItem.peopleQuantity.adult +
        Number(
            cartItem.dataFlightDeparture?.seats_quantity?.[0]?.child_price
                ?.$numberDecimal || 0
        ) *
            cartItem.peopleQuantity.child
    );
};

module.exports = {
    parseDate,
    formatPriceVND,
    getHourMinute,
    getFlightDuration,
    getDateOnly,
    getDuration,
    calculaterPriceFlightRoundTrip,
    calculaterPriceFlightOneWay,
};
