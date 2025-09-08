import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getDateOnly, getFlightDuration } from '../../../utils/myFunction';
import { useFormatter } from '../../hooks/useFomatter';
import DynamicIcon from './DynamicIcon';
import { BiSolidShoppingBags } from 'react-icons/bi';
import dayjs from 'dayjs';
import { ImCancelCircle } from 'react-icons/im';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../Translate';

const FlightSelectedInformation = (props) => {
    const { t } = useTranslation();
    const dataFlight = props.dataFlight;

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };
    const colorGray = 'gray';

    return (
        <>
            {dataFlight && Object.keys(dataFlight).length > 0 && (
                <div className="modal show">
                    <Modal show={props.show} onHide={props.setShow} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {
                                    dataFlight.segments[0].departure_airport_id
                                        .province
                                }{' '}
                                -{' '}
                                {
                                    dataFlight.segments[
                                        dataFlight.segments.length - 1
                                    ].arrival_airport_id.province
                                }
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center gap-2">
                                    <img
                                        style={{
                                            width: '80px',
                                            height: '40px',
                                        }}
                                        src={dataFlight.airline.logo_url}
                                    />
                                    <h6 className="mb-0">
                                        {dataFlight.airline.name}
                                    </h6>
                                </div>
                                <span
                                    className="mb-2"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {dataFlight.flight_number} -{' '}
                                    {props.currentChooseSeatClass ? (
                                        <TranslateText
                                            text={
                                                props.currentChooseSeatClass
                                                    .name
                                            }
                                        />
                                    ) : (
                                        //  props.currentChooseSeatClass.name
                                        // dataFlight.seats_quantity[0]
                                        //     .seat_class_id.name
                                        <TranslateText
                                            text={
                                                dataFlight.seats_quantity[0]
                                                    .seat_class_id.name
                                            }
                                        />
                                    )}
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex gap-5">
                                    <div>
                                        {dataFlight.segments.length > 0 &&
                                            dataFlight.segments.map(
                                                (flightItem, index) => (
                                                    <div
                                                        className="d-flex gap-3 mt-4"
                                                        key={index}
                                                    >
                                                        <div className="d-flex flex-column">
                                                            <div>
                                                                <h6 className="mb-0">
                                                                    {formatUtcToLocal(
                                                                        flightItem.departure_time,
                                                                        flightItem
                                                                            .departure_airport_id
                                                                            .time_zon
                                                                    )}
                                                                </h6>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '13px',
                                                                    }}
                                                                >
                                                                    {getDateOnly(
                                                                        flightItem.departure_time
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <span
                                                                className="mt-3 mb-3"
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                }}
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
                                                                        flightItem
                                                                            .arrival_airport_id
                                                                            .time_zon
                                                                    )}
                                                                </h6>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '13px',
                                                                    }}
                                                                >
                                                                    {getDateOnly(
                                                                        flightItem.arrival_time
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                                            <div
                                                                className="bg-info mt-1 rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                }}
                                                            ></div>

                                                            <hr
                                                                className="mt-0 mb-0"
                                                                style={{
                                                                    height: '110px',
                                                                    width: '1px',
                                                                }}
                                                            ></hr>

                                                            <div
                                                                className="bg-info rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                }}
                                                            ></div>
                                                        </div>

                                                        <div className="d-flex flex-column justify-content-between">
                                                            <div>
                                                                <div className="d-flex">
                                                                    <div>
                                                                        {
                                                                            flightItem
                                                                                .departure_airport_id
                                                                                .province
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        -{' '}
                                                                        {
                                                                            flightItem
                                                                                .departure_airport_id
                                                                                .code
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    <TranslateText
                                                                        text={
                                                                            flightItem
                                                                                .departure_airport_id
                                                                                .name
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="d-flex">
                                                                    <div>
                                                                        {
                                                                            flightItem
                                                                                .arrival_airport_id
                                                                                .province
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        -{' '}
                                                                        {
                                                                            flightItem
                                                                                .arrival_airport_id
                                                                                .code
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    {/* {
                                                                        flightItem
                                                                            .arrival_airport_id
                                                                            .name
                                                                    } */}
                                                                    <TranslateText
                                                                        text={
                                                                            flightItem
                                                                                .arrival_airport_id
                                                                                .name
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                    <div>
                                        <li
                                            className="mb-2 mt-4"
                                            style={{ fontWeight: 600 }}
                                        >
                                            {t(
                                                'flightSelectedInformation.title'
                                            )}
                                        </li>

                                        <div
                                            className="d-flex align-items-start gap-2 mb-2"
                                            style={{ paddingLeft: '25px' }}
                                        >
                                            <BiSolidShoppingBags color="gray" />
                                            <div className="d-flex flex-column">
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: 'gray',
                                                    }}
                                                >
                                                    {
                                                        dataFlight
                                                            .seats_quantity[0]
                                                            .free_baggage
                                                    }{' '}
                                                    {t(
                                                        'flightSelectedInformation.numberFreeBaggage'
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: 'gray',
                                                    }}
                                                >
                                                    {
                                                        dataFlight
                                                            .seats_quantity[0]
                                                            .carry_on_baggage
                                                    }{' '}
                                                    {t(
                                                        'flightSelectedInformation.numberCarryOnBaggage'
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="d-flex gap-3 mb-2"
                                            style={{
                                                maxWidth: '650px',
                                                flexWrap: 'wrap',
                                                paddingLeft: '25px',
                                            }}
                                        >
                                            {props.currentChooseSeatClass
                                                ? dataFlight.seats_quantity
                                                      .filter(
                                                          (item) =>
                                                              item.seat_class_id
                                                                  ._id ===
                                                              props
                                                                  .currentChooseSeatClass
                                                                  ._id
                                                      )
                                                      .map((item, idx) =>
                                                          item.utils.map(
                                                              (
                                                                  utils,
                                                                  index
                                                              ) => (
                                                                  <div
                                                                      className="d-flex gap-2 align-items-center"
                                                                      key={
                                                                          idx +
                                                                          '-' +
                                                                          index
                                                                      }
                                                                  >
                                                                      <DynamicIcon
                                                                          iconName={
                                                                              utils.name
                                                                          }
                                                                          size={
                                                                              16
                                                                          }
                                                                          color={
                                                                              colorGray
                                                                          }
                                                                      />
                                                                      <div
                                                                          style={{
                                                                              fontSize:
                                                                                  '14px',
                                                                              color: 'gray',
                                                                          }}
                                                                      >
                                                                          {/* {
                                                                              utils.name
                                                                          } */}
                                                                          <TranslateText
                                                                              text={
                                                                                  utils.name
                                                                              }
                                                                          />
                                                                      </div>
                                                                  </div>
                                                              )
                                                          )
                                                      )
                                                : dataFlight.seats_quantity
                                                      .length > 0 &&
                                                  dataFlight.seats_quantity[0].utils.map(
                                                      (utils, index) => (
                                                          <div
                                                              className="d-flex gap-2 align-items-center"
                                                              key={index}
                                                          >
                                                              <DynamicIcon
                                                                  iconName={
                                                                      utils.name
                                                                  }
                                                                  size={16}
                                                                  color={
                                                                      colorGray
                                                                  }
                                                              />
                                                              <div
                                                                  style={{
                                                                      fontSize:
                                                                          '14px',
                                                                      color: 'gray',
                                                                  }}
                                                              >
                                                                  {/* {utils.name} */}
                                                                  <TranslateText
                                                                      text={
                                                                          utils.name
                                                                      }
                                                                  />
                                                              </div>
                                                          </div>
                                                      )
                                                  )}
                                        </div>

                                        <li
                                            className="mt-4"
                                            style={{ fontWeight: 600 }}
                                        >
                                            {t(
                                                'flightSelectedInformation.changeSupport'
                                            )}
                                        </li>
                                        {(() => {
                                            let seatClassObj;
                                            if (props.currentChooseSeatClass) {
                                                seatClassObj =
                                                    dataFlight.seats_quantity.find(
                                                        (item) =>
                                                            item.seat_class_id
                                                                ._id ===
                                                            props
                                                                .currentChooseSeatClass
                                                                ._id
                                                    );
                                            } else {
                                                seatClassObj =
                                                    dataFlight
                                                        .seats_quantity[0];
                                            }

                                            if (!seatClassObj) return null;

                                            return seatClassObj.changeFlight ===
                                                'no' ? (
                                                <div
                                                    style={{
                                                        paddingTop: '5px',
                                                        paddingLeft: '25px',
                                                    }}
                                                >
                                                    <div
                                                        className="d-flex align-items-center gap-2 bg-warning p-2 rounded mb-3"
                                                        style={{
                                                            width: 'fit-content',
                                                        }}
                                                    >
                                                        <ImCancelCircle color="red" />
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '15px',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'flightSelectedInformation.no'
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        paddingLeft: '25px',
                                                        paddingTop: '5px',
                                                    }}
                                                >
                                                    <div
                                                        className="d-flex align-items-center gap-2 p-2 rounded mb-3"
                                                        style={{
                                                            width: 'fit-content',
                                                            backgroundColor:
                                                                'rgb(252, 236, 221)',
                                                        }}
                                                    >
                                                        <IoCheckmarkDoneSharp color="green" />
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '15px',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'flightSelectedInformation.yes'
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <li
                                            className="mt-3"
                                            style={{ fontWeight: 600 }}
                                        >
                                            {t(
                                                'flightSelectedInformation.refundSupport'
                                            )}
                                        </li>
                                        {(() => {
                                            let seatClassObj;
                                            if (props.currentChooseSeatClass) {
                                                seatClassObj =
                                                    dataFlight.seats_quantity.find(
                                                        (item) =>
                                                            item.seat_class_id
                                                                ._id ===
                                                            props
                                                                .currentChooseSeatClass
                                                                ._id
                                                    );
                                            } else {
                                                seatClassObj =
                                                    dataFlight
                                                        .seats_quantity[0];
                                            }

                                            if (!seatClassObj) return null;

                                            return seatClassObj.refundMoney ===
                                                0 ? (
                                                <div
                                                    style={{
                                                        paddingTop: '5px',
                                                        paddingLeft: '25px',
                                                    }}
                                                >
                                                    <div
                                                        className="d-flex align-items-center gap-2 bg-warning p-2 rounded mb-3"
                                                        style={{
                                                            width: 'fit-content',
                                                        }}
                                                    >
                                                        <ImCancelCircle color="red" />
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '15px',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'flightSelectedInformation.no'
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        paddingTop: '5px',
                                                        paddingLeft: '25px',
                                                    }}
                                                >
                                                    <div
                                                        className="d-flex align-items-center gap-2 p-2 rounded mb-3"
                                                        style={{
                                                            width: 'fit-content',
                                                            backgroundColor:
                                                                'rgb(252, 236, 221)',
                                                        }}
                                                    >
                                                        <IoCheckmarkDoneSharp color="green" />
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '15px',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'flightSelectedInformation.yes'
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={props.setShow}>
                                {t('flightSelectedInformation.close')}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </>
    );
};
export default FlightSelectedInformation;
