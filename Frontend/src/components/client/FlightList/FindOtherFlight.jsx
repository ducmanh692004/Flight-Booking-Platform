import { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaPlane } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Search from '../Header/Search';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../Translate';

const FindOtherFlight = (props) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('Thứ 5, 12 thg 6');
    const [sortOption, setSortOption] = useState('Ưu tiên bay thẳng');
    const [dataSearch, setDataSearch] = useState({});
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (props.dataSearch && props.dataSearch.people_quantity) {
            setDataSearch(props.dataSearch);
        }
    }, [props.dataSearch]);

    const fs_1 = '13px';
    const fs_2 = '15px';

    const handleShowSearchBlock = () => {
        setShow(!show);
    };

    // const handleClose = () => {};
    const handleClose = () => setShow(false);

    return (
        <div className="container-fluid px-0 d-flex justify-content-center flex-column">
            {/* Header Section */}
            <div className="row">
                <div className="col-12">
                    <div
                        className="card border-0 rounded-4 shadow-lg"
                        style={{
                            background:
                                'linear-gradient(135deg, #4285f4 0%, #1e3a8a 100%)',
                            minHeight: '150px',
                        }}
                    >
                        <div className="card-body pt-3 px-3 pb-0">
                            {/* Flight Route Card */}
                            <div
                                className="card bg-white rounded-3 shadow-sm mb-1"
                                onClick={() => handleShowSearchBlock()}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-body px-3 pt-1 pb-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center flex-grow-1">
                                            <h5 className="mb-0 fw-bold text-dark">
                                                {
                                                    dataSearch.departure_destination
                                                }{' '}
                                                -{' '}
                                                {dataSearch.arrival_destination}
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <FaSearch
                                                className="text-primary mt-1"
                                                size={20}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-0">
                                        <small className="text-muted">
                                            {dataSearch.departure_date} |{' '}
                                            {(dataSearch.people_quantity
                                                ?.adult || 0) +
                                                (dataSearch.people_quantity
                                                    ?.child || 0)}{' '}
                                            {t('findOtherFlight.passengers')} |{' '}
                                            {/* {dataSearch.seat_class?.name} */}
                                            <TranslateText
                                                text={
                                                    dataSearch.seat_class?.name
                                                }
                                            />
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flight Info Cards */}
                        <div className="pt-0 px-3 pb-3">
                            <div className="mt-1 bg-light d-flex p-1 pt-2 pb-2 rounded justify-content-between px-3">
                                <div
                                    className="col-4 d-flex flex-column justify-content-center align-items-start p-1"
                                    onClick={() =>
                                        props.handleChangePriceSort('ASC')
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        width: 'fit-content',
                                        borderBottom:
                                            props.filterPrice === 'ASC'
                                                ? '2px solid rgb(27, 86, 253)'
                                                : '',
                                    }}
                                >
                                    <h6
                                        className="text-primary mb-0"
                                        style={{ fontSize: fs_2 }}
                                    >
                                        {t('findOtherFlight.lowestPrice')}
                                    </h6>
                                </div>

                                <div
                                    className="col-4 d-flex flex-column justify-content-center align-items-start p-1"
                                    onClick={() =>
                                        props.handleChangePriceSort('DESC')
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        width: 'fit-content',
                                        borderBottom:
                                            props.filterPrice === 'DESC'
                                                ? '2px solid rgb(27, 86, 253)'
                                                : '',
                                    }}
                                >
                                    <h6
                                        className="text-primary mb-0"
                                        style={{ fontSize: fs_2 }}
                                    >
                                        {t('findOtherFlight.highestPrice')}
                                    </h6>
                                </div>

                                <div
                                    className="col-4 d-flex flex-column justify-content-start align-items-start p-1"
                                    onClick={() =>
                                        props.handleChangeStopDuration(0)
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        width: 'fit-content',
                                        borderBottom:
                                            props.dataStopDuration.includes(0)
                                                ? '2px solid rgb(27, 86, 253)'
                                                : '',
                                    }}
                                >
                                    <h6
                                        className="text-primary mb-0"
                                        style={{ fontSize: fs_2 }}
                                    >
                                        {t(
                                            'findOtherFlight.directFlightPriority'
                                        )}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} animation={false} size="xl">
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="pt-5 pb-5">
                    {Object.keys(dataSearch).length > 0 && (
                        <Search
                            dataSearch={dataSearch}
                            takeDataFromUrl={props.takeDataFromUrl}
                            handleClose={handleClose}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FindOtherFlight;
