import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Figure from 'react-bootstrap/Figure';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import './NearByDestination.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFetchFlightHomePage } from '../../../services/UserFlightList';
import { useHistory } from 'react-router-dom';

const NearByDestination = (props) => {
    const { t } = useTranslation();
    const history = useHistory();

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1025 },
            items: 5,
        },
        tablet: {
            breakpoint: { max: 1024, min: 821 },
            items: 4,
        },
        minitablet: {
            breakpoint: { max: 820, min: 765 },
            items: 3,
        },
        mobile: {
            breakpoint: { max: 764, min: 0 },
            items: 2,
        },
    };

    const [listNearByDestination, setListNearByDestination] = useState([]);

    // const handleFetchData = async () => {
    //     const response = await handleFetchFlightHomePage(1);
    //     if (response && response.EC === 0) {
    //         setListNearByDestination(response.DT);
    //     }
    // };

    useEffect(() => {
        // handleFetchData();
        if (props.arr && props.arr.length > 0) {
            setListNearByDestination(props.arr);
        }
    }, [props.arr]);

    const CustomRightArrow = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                style={{
                    width: '35px',
                    height: '35px',
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'gray',
                    color: 'black',
                    border: '1px solid gray',
                    zIndex: 10,
                }}
            >
                <MdNavigateNext className="fs-5" color="white" />
            </button>
        );
    };

    const CustomLeftArrow = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                style={{
                    width: '35px',
                    height: '35px',
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'gray',
                    color: 'black',
                    border: '1px solid gray',
                    zIndex: 10,
                }}
            >
                <GrFormPrevious className="fs-5" color="white" />
            </button>
        );
    };

    const handleNavigate = (item) => {
        const newComebackDate =
            'Tue Aug 05 2025 14:30:00 GMT+0700 (Indochina Time)'; // tương tự
        const flightType = 'one-way';
        const peopleQuantity = { adult: 1, child: 0 };
        const seatClassSelect = {
            id: '684c0f64351062930ad28ff5',
            name: 'Hạng phổ thông',
        };

        history.push(
            `/flightList?` +
                `departure_destination=${item.departureProvince}` +
                `&arrival_destination=${item.arrivalProvince}` +
                `&departure_date=${new Date(item.departure)}` +
                `&comeback_date=${newComebackDate}` +
                `&flight_type=${flightType}` +
                `&people_quantity=${JSON.stringify(peopleQuantity)}` +
                `&seat_class=${JSON.stringify(seatClassSelect)}`
        );
    };

    return (
        <>
            <h4 className="mb-2 ms-2 fs-4">{t('nearDestination.title')}</h4>
            {/* <h4 className="mb-2 ms-2 fs-4">Các điểm đến gần bạn</h4> */}

            <Carousel
                responsive={responsive}
                className="carousel"
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
            >
                {listNearByDestination &&
                    listNearByDestination.length > 0 &&
                    listNearByDestination.map((item, index) => {
                        return (
                            <div
                                className="p-1 p-md-2"
                                style={{ height: '230px' }}
                                key={index}
                            >
                                <img
                                    src={item.image}
                                    onClick={() => handleNavigate(item)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label>
                                    {item.departureProvince}{' '}
                                    {t('nearDestination.to')}{' '}
                                    {item.arrivalProvince}
                                </label>
                            </div>
                        );
                    })}
            </Carousel>
        </>
    );
};

export default NearByDestination;
