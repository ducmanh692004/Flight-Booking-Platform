import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Form,
    FormControl,
    InputGroup,
    Row,
    Col,
    Modal,
    Spinner,
    Badge,
} from 'react-bootstrap';
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaPlus,
    FaSearch,
    FaPlaneDeparture,
    FaClock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import {
    adminDeleteFlight,
    adminGetAllFlight,
} from '../../../services/AdminService';
import { FaPlaneArrival } from 'react-icons/fa';
import FlightDetailModal from './viewDetailFlight';
import AddFlight from './addFlight';
import UpdateFlight from './updateFlight';

// Import useTranslation hook từ react-i18next
import { useTranslation } from 'react-i18next';

const ViewFlights = () => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [flights, setFlights] = useState([]);

    const [showUpdateFlight, setShowUpdateFlight] = useState(false);
    const [flightUpdate, setFlightUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);

    const [showAddFlightModal, setShowAddFlightModal] = useState(false);

    const [showFlightDetailModal, setShowFlightDetailModal] = useState(false);
    const [flightDetail, setFlightDetail] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);

    const handleFetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleViewDetailFlight = (flightId) => {
        setFlightDetail(flightId);
        setShowFlightDetailModal(true);
    };

    const handleCloseDetailFlightModal = () => {
        setShowFlightDetailModal(false);
        setFlightDetail(null);
    };

    const handleEditFlight = (flightId) => {
        setFlightUpdate(flightId);
        setShowUpdateFlight(true);
    };

    const handleCloseUpdateFlight = () => {
        setShowUpdateFlight(false);
        setFlightUpdate(null);
    };

    const handleAddNewFlight = () => {
        setShowAddFlightModal(true);
    };

    const handleCloseAddFlightModal = () => {
        setShowAddFlightModal(false);
    };

    const fetchFlights = async () => {
        try {
            const data = await adminGetAllFlight(currentLimit, currentPage);
            if (data && data.EC === 0) {
                setFlights(data.DT.flightData);
                setTotalPage(data.DT.totalPages);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteButtonClick = (flightId) => {
        setFlightToDelete(flightId);
        setShowDeleteConfirmModal(true);
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setFlightToDelete(null);
    };

    const handleDeleteFlight = async () => {
        const response = await adminDeleteFlight(flightToDelete);
        if (response && response.EC === 0) {
            toast.success(response.EM);
            handleCloseDeleteConfirmModal();
            handleFetchDataAgain();
        } else {
            toast.error(response.EM);
            handleCloseDeleteConfirmModal();
        }
    };

    useEffect(() => {
        fetchFlights();
    }, [currentPage, fetchDataAgain]);

    // Hàm định dạng thời gian (không liên quan đến i18n trực tiếp)
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <div
            style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '25px',
            }}
        >
            {showFlightDetailModal && (
                <FlightDetailModal
                    show={showFlightDetailModal}
                    handleClose={handleCloseDetailFlightModal}
                    flightId={flightDetail}
                />
            )}

            {showUpdateFlight && (
                <UpdateFlight
                    show={showUpdateFlight}
                    handleClose={handleCloseUpdateFlight}
                    flightId={flightUpdate}
                />
            )}

            {showAddFlightModal && (
                <AddFlight
                    show={showAddFlightModal}
                    handleClose={handleCloseAddFlightModal}
                    handleRefetch={handleFetchDataAgain}
                />
            )}

            <Modal show={showDeleteConfirmModal} centered>
                <Modal.Header
                    closeButton
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                >
                    <Modal.Title>
                        {t('viewFlights.deleteModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewFlights.deleteModal.message')}
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        {' '}
                        {flightToDelete}{' '}
                    </span>
                    {t('viewFlights.deleteModal.messageSuffix')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteFlight()}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: '8px' }}
                                />
                                {t('viewFlights.deleteModal.deletingButton')}
                            </>
                        ) : (
                            t('viewFlights.deleteModal.deleteButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteConfirmModal}
                        disabled={isDeleting}
                    >
                        {t('viewFlights.deleteModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <h4
                style={{
                    marginBottom: '24px',
                    color: '#343a40',
                    fontWeight: '600',
                }}
            >
                {t('viewFlights.title')}
            </h4>
            <Row style={{ marginBottom: '16px', alignItems: 'center' }}>
                <Col md={4} style={{ textAlign: 'start' }}>
                    <Button
                        variant="primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#007bff',
                            borderColor: '#007bff',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        onClick={handleAddNewFlight}
                    >
                        <FaPlus style={{ marginRight: '8px' }} />
                        <span> {t('viewFlights.addNewButton')}</span>
                    </Button>
                </Col>
            </Row>

            <Table
                bordered
                hover
                responsive
                style={{
                    boxShadow:
                        '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                            }}
                        >
                            {t('viewFlights.table.hash')}
                        </th>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                            }}
                        >
                            {t('viewFlights.table.airline')}
                        </th>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                            }}
                        >
                            {t('viewFlights.table.flightNumber')}
                        </th>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                            }}
                        >
                            {t('viewFlights.table.route')}
                        </th>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                            }}
                        >
                            {t('viewFlights.table.status')}
                        </th>
                        <th
                            style={{
                                color: '#495057',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                                textAlign: 'center',
                            }}
                        >
                            {t('viewFlights.table.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {flights.length > 0 ? (
                        flights.map((flight, index) => (
                            <tr
                                key={flight._id}
                                style={{ verticalAlign: 'middle' }}
                            >
                                <td
                                    style={{
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    {index +
                                        1 +
                                        (currentPage - 1) * currentLimit}
                                </td>
                                <td
                                    style={{
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <div className="d-flex flex-column">
                                        {flight.airline?.logo_url && (
                                            <img
                                                src={flight.airline.logo_url}
                                                alt={
                                                    flight.airline?.name ||
                                                    'Airline Logo'
                                                }
                                                style={{
                                                    width: '80px',
                                                    height: '30px',
                                                    borderRadius: '4px',
                                                    marginRight: '8px',
                                                    boxShadow:
                                                        '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                        )}
                                        {flight.airline?.name || 'N/A'}
                                    </div>
                                </td>
                                <td
                                    style={{
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    {flight.flight_number}
                                </td>
                                <td
                                    style={{
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    {flight.segments &&
                                    flight.segments.length > 0 ? (
                                        <ul
                                            style={{
                                                listStyle: 'none',
                                                padding: 0,
                                                marginBottom: 0,
                                                fontSize: '0.9em',
                                            }}
                                        >
                                            <li
                                                style={{
                                                    marginBottom: '5px',
                                                    lineHeight: '1.4',
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <FaPlaneDeparture className="text-primary fs-6" />
                                                    <span className="fs-6">
                                                        {
                                                            flight.segments[0]
                                                                .departure_airport_id
                                                                .province
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                            flight.segments[0]
                                                                .departure_airport_id
                                                                .code
                                                        }
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <FaPlaneArrival className="text-primary fs-6" />
                                                    <span className="fs-6">
                                                        {
                                                            flight.segments[
                                                                flight.segments
                                                                    .length - 1
                                                            ].arrival_airport_id
                                                                .province
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                            flight.segments[
                                                                flight.segments
                                                                    .length - 1
                                                            ].arrival_airport_id
                                                                .code
                                                        }
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td
                                    style={{
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <Badge
                                        bg={
                                            flight.status === 'active'
                                                ? 'success'
                                                : 'secondary'
                                        }
                                        style={{
                                            fontSize: '0.85em',
                                            padding: '0.5em 0.8em',
                                            borderRadius: '0.35rem',
                                        }}
                                    >
                                        {flight.status === 'active'
                                            ? t('viewFlights.status.active')
                                            : t('viewFlights.status.inactive')}
                                    </Badge>
                                </td>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '12px 10px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <Button
                                        variant="info"
                                        size="sm"
                                        style={{
                                            fontSize: '0.8em',
                                            padding: '6px 10px',
                                            marginRight: '8px',
                                        }}
                                        onClick={() =>
                                            handleViewDetailFlight(flight._id)
                                        }
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        style={{
                                            fontSize: '0.8em',
                                            padding: '6px 10px',
                                            marginRight: '8px',
                                        }}
                                        onClick={() =>
                                            handleEditFlight(flight._id)
                                        }
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(flight._id)
                                        }
                                        disabled={isDeleting}
                                        style={{
                                            fontSize: '0.8em',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                style={{ textAlign: 'center', padding: '40px' }}
                            >
                                {t('viewFlights.table.noFlightsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 0 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '16px',
                    }}
                >
                    <ReactPaginate
                        nextLabel={t('viewFlights.pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={totalPage}
                        previousLabel={t('viewFlights.pagination.previous')}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewFlights;
