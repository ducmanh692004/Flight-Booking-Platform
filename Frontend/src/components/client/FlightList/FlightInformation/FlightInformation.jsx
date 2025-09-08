import DynamicIcon from '../DynamicIcon';
import { getFlightDuration, getDateOnly } from '../../../../utils/myFunction';
import dayjs from 'dayjs';
import { BiSolidShoppingBags } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../../Translate';

const FlightInformation = (props) => {
    const { t } = useTranslation();
    const flight = props.dataFlight;

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };
    const fontWeight = 600;
    const colorGray = 'gray';
    return (
        <>
            <hr style={{ height: '0.8px' }}></hr>
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                    <img
                        style={{ width: '40px', height: '12px' }}
                        src={flight.airline.logo_url}
                    />
                    <h6 className="mb-0">{flight.airline.name}</h6>
                </div>
                <span
                    className="mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                >
                    {flight.flight_number} -{' '}
                    <TranslateText
                        text={flight.seats_quantity[0].seat_class_id.name}
                    />
                    {/* {flight.seats_quantity[0].seat_class_id.name} */}
                </span>

                <div
                    className="d-flex gap-3 mb-2"
                    style={{ maxWidth: '700px', flexWrap: 'wrap' }}
                >
                    {flight.seats_quantity.length > 0 &&
                        flight.seats_quantity[0].utils.map((utils, index) => (
                            <div
                                className="d-flex gap-2 align-items-center"
                                key={index}
                            >
                                <DynamicIcon
                                    iconName={utils.name}
                                    size={16}
                                    color={colorGray}
                                />
                                <div
                                    style={{ fontSize: '14px', color: 'gray' }}
                                >
                                    {/* {utils.name} */}
                                    <TranslateText text={utils.name} />
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-2">
                    <BiSolidShoppingBags color="gray" />
                    <div className="d-flex flex-column">
                        <div style={{ fontSize: '14px', color: 'gray' }}>
                            {flight.seats_quantity[0].free_baggage}{' '}
                            {t('flightInformation.freeBaggage')}
                        </div>
                        <div style={{ fontSize: '14px', color: 'gray' }}>
                            {flight.seats_quantity[0].carry_on_baggage}{' '}
                            {t('flightInformation.carryOnBaggage')}
                        </div>
                    </div>
                </div>
                {flight.segments.length > 0 &&
                    flight.segments.map((flightItem, index) => (
                        <div className="d-flex gap-3" key={index}>
                            <div className="d-flex flex-column">
                                <div>
                                    <h6 className="mb-0">
                                        {formatUtcToLocal(
                                            flightItem.departure_time,
                                            flightItem.departure_airport_id
                                                .time_zon
                                        )}
                                    </h6>
                                    <span style={{ fontSize: '13px' }}>
                                        {getDateOnly(flightItem.departure_time)}
                                    </span>
                                </div>

                                <span
                                    className="mt-5 mb-5"
                                    style={{ fontSize: '14px' }}
                                >
                                    {getFlightDuration(
                                        flightItem.departure_time,
                                        flightItem.arrival_time
                                    )}
                                </span>

                                <div>
                                    <h6 className="mb-0">
                                        {formatUtcToLocal(
                                            flightItem.arrival_time,
                                            flightItem.arrival_airport_id
                                                .time_zon
                                        )}
                                    </h6>
                                    <span style={{ fontSize: '13px' }}>
                                        {getDateOnly(flightItem.arrival_time)}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <div
                                    className="bg-info mt-1 rounded-circle"
                                    style={{ width: '10px', height: '10px' }}
                                ></div>

                                <hr
                                    className="mt-0 mb-0"
                                    style={{ height: '170px', width: '1px' }}
                                ></hr>

                                <div
                                    className="bg-info rounded-circle"
                                    style={{ width: '10px', height: '10px' }}
                                ></div>
                            </div>

                            <div className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex">
                                        <div>
                                            {
                                                flightItem.departure_airport_id
                                                    .province
                                            }
                                        </div>
                                        <div>
                                            -{' '}
                                            {
                                                flightItem.departure_airport_id
                                                    .code
                                            }
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        {/* {flightItem.departure_airport_id.name} */}
                                        <TranslateText
                                            text={
                                                flightItem.departure_airport_id
                                                    .name
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex">
                                        <div>
                                            {
                                                flightItem.arrival_airport_id
                                                    .province
                                            }
                                        </div>
                                        <div>
                                            -{' '}
                                            {flightItem.arrival_airport_id.code}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        {/* {flightItem.arrival_airport_id.name} */}
                                        <TranslateText
                                            text={
                                                flightItem.arrival_airport_id
                                                    .name
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default FlightInformation;
