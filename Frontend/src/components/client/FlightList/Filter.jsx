import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next';

const Filter = (props) => {
    const flightData = props.flightData;
    const { formatCurrency } = useFormatter();
    const {
        handleChangeAirline,
        handleChangeStopDuration,
        handleChangeDepartureTime,
        handleChangeArrivalTime,
        handleResetFilters,
        filters,
    } = props;

    const [collapsedSections, setCollapsedSections] = useState({
        stopTypes: false,
        airlines: false,
        flightTime: false,
        departureTime: false,
        arrivalTime: false,
    });

    const toggleSection = (section) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    let uniqueAirline = [];
    const { t } = useTranslation();

    return (
        <div className="card shadow-sm mt-3" style={{ maxWidth: '100%' }}>
            <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
                <h6 className="mb-0 fw-bold">{t('filter.title')}</h6>
                <a
                    href="#"
                    className="text-primary text-decoration-none small"
                    onClick={() => handleResetFilters()}
                >
                    {t('filter.reset')}
                </a>
            </div>

            <div className="card-body p-0">
                {/* Số điểm dừng */}
                <div className="border-bottom">
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">{t('filter.stopCount')}</h6>
                            <button
                                className="btn btn-sm p-1"
                                onClick={() => toggleSection('stopTypes')}
                            >
                                {collapsedSections.stopTypes ? (
                                    <FaChevronDown size={16} />
                                ) : (
                                    <FaChevronUp size={16} />
                                )}
                            </button>
                        </div>

                        {!collapsedSections.stopTypes && (
                            <>
                                <div className="form-check d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            id="nonStop"
                                            onChange={() =>
                                                handleChangeStopDuration(0)
                                            }
                                            checked={filters.stopTypes.includes(
                                                0
                                            )}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="nonStop"
                                        >
                                            {t('filter.nonStop')}
                                        </label>
                                    </div>
                                </div>

                                <div className="form-check d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            id="oneStop"
                                            onChange={() =>
                                                handleChangeStopDuration(1)
                                            }
                                            checked={filters.stopTypes.includes(
                                                1
                                            )}
                                        />
                                        <label
                                            className="form-check-label text-muted"
                                            htmlFor="oneStop"
                                        >
                                            {t('filter.oneStop')}
                                        </label>
                                    </div>
                                </div>

                                <div className="form-check d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            id="twoStop"
                                            onChange={() =>
                                                handleChangeStopDuration(2)
                                            }
                                            checked={filters.stopTypes.includes(
                                                2
                                            )}
                                        />
                                        <label
                                            className="form-check-label text-muted"
                                            htmlFor="twoStop"
                                        >
                                            {t('filter.twoStop')}
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Hãng hàng không */}
                <div className="border-bottom">
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">{t('filter.airlines')}</h6>
                            <button
                                className="btn btn-sm p-1"
                                onClick={() => toggleSection('airlines')}
                            >
                                {collapsedSections.airlines ? (
                                    <FaChevronDown size={16} />
                                ) : (
                                    <FaChevronUp size={16} />
                                )}
                            </button>
                        </div>

                        {!collapsedSections.airlines && (
                            <>
                                {Array.isArray(flightData) &&
                                    flightData.length > 0 &&
                                    (() => {
                                        const uniqueAirlineNames = [];
                                        return flightData
                                            .filter((flight) => {
                                                const name =
                                                    flight?.airline?.name;
                                                if (!name) return false;
                                                if (
                                                    !uniqueAirlineNames.includes(
                                                        name
                                                    )
                                                ) {
                                                    uniqueAirlineNames.push(
                                                        name
                                                    );
                                                    return true;
                                                }
                                                return false;
                                            })
                                            .map((flight, index) => (
                                                <div
                                                    className="form-check d-flex justify-content-between align-items-center mb-3"
                                                    key={index}
                                                >
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <input
                                                            className="form-check-input me-2"
                                                            type="checkbox"
                                                            id={
                                                                flight.airline
                                                                    .name
                                                            }
                                                            checked={filters.airlines.includes(
                                                                flight.airline
                                                                    .name
                                                            )}
                                                            onChange={() =>
                                                                handleChangeAirline(
                                                                    flight
                                                                        .airline
                                                                        .name
                                                                )
                                                            }
                                                        />
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                style={{
                                                                    width: '60px',
                                                                    height: '20px',
                                                                }}
                                                                src={
                                                                    flight
                                                                        .airline
                                                                        .logo_url
                                                                }
                                                                alt={
                                                                    flight
                                                                        .airline
                                                                        .name
                                                                }
                                                            />
                                                            <div>
                                                                <div className="fw-medium">
                                                                    {
                                                                        flight
                                                                            .airline
                                                                            .name
                                                                    }
                                                                </div>
                                                                <small className="text-muted">
                                                                    {formatCurrency(
                                                                        flight
                                                                            ?.seats_quantity?.[0]
                                                                            ?.price
                                                                            ?.$numberDecimal ||
                                                                            0
                                                                    )}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ));
                                    })()}
                            </>
                        )}
                    </div>
                </div>

                {/* Giờ cất cánh */}
                <div className="border-bottom">
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">{t('filter.departureTime')}</h6>
                            <button
                                className="btn btn-sm p-1"
                                onClick={() => toggleSection('departureTime')}
                            >
                                {collapsedSections.departureTime ? (
                                    <FaChevronDown size={16} />
                                ) : (
                                    <FaChevronUp size={16} />
                                )}
                            </button>
                        </div>

                        {!collapsedSections.departureTime && (
                            <>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.departure_time.includes(
                                                    6
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeDepartureTime(6)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.nightToMorning')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                00:00 - 06:00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.departure_time.includes(
                                                    12
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeDepartureTime(12)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.morningToNoon')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                06:00 - 12:00
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.departure_time.includes(
                                                    18
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeDepartureTime(18)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.noonToEvening')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                12:00 - 18:00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.departure_time.includes(
                                                    24
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeDepartureTime(24)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.eveningToNight')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                18:00 - 24:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Giờ hạ cánh */}
                <div>
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">{t('filter.arrivalTime')}</h6>
                            <button
                                className="btn btn-sm p-1"
                                onClick={() => toggleSection('arrivalTime')}
                            >
                                {collapsedSections.arrivalTime ? (
                                    <FaChevronDown size={16} />
                                ) : (
                                    <FaChevronUp size={16} />
                                )}
                            </button>
                        </div>

                        {!collapsedSections.arrivalTime && (
                            <>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.arrival_time.includes(6)
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeArrivalTime(6)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.nightToMorning')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                00:00 - 06:00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.arrival_time.includes(
                                                    12
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeArrivalTime(12)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.morningToNoon')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                06:00 - 12:00
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.arrival_time.includes(
                                                    18
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeArrivalTime(18)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.noonToEvening')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                12:00 - 18:00
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div
                                            className={`border rounded p-2 text-center ${
                                                filters.arrival_time.includes(
                                                    24
                                                )
                                                    ? 'border-primary bg-light'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleChangeArrivalTime(24)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <small className="text-muted d-block">
                                                {t('filter.eveningToNight')}
                                            </small>
                                            <div className="text-primary fw-medium">
                                                18:00 - 24:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
