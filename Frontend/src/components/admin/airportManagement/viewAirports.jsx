import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import {
    adminDeleteAirport,
    adminGetAllAirport,
} from '../../../services/AdminService';
import AddAirport from './addAirport';
import UpdateAirport from './updateAirport';
import ViewAirportDetails from './viewDetail';
import { TranslateText } from '../../Translate';

const ViewAirports = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showUpdateAirport, setShowUpdateAirport] = useState(false);
    const [airportToUpdate, setAirportToUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [airportToDelete, setAirportToDelete] = useState(null);

    const [showDetail, setShowDetail] = useState(false);
    const [airportDetail, setAirportDetail] = useState(null);

    const [showAddAirportModal, setShowAddAirportModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(11);

    const handleCloseAddAirportModal = () => {
        setShowAddAirportModal(false);
        handleFetchDataAgain();
    };

    const handleCloseUpdateAirportModal = () => {
        setShowUpdateAirport(false);
        handleFetchDataAgain();
    };

    const handleCloseDetailAirport = () => {
        setShowDetail(false);
        // handleFetchDataAgain(); // You might not want to refetch on just closing detail
    };

    const handleViewDetailAirport = (airport) => {
        setAirportDetail(airport);
        setShowDetail(true);
    };

    const handleAddNewAirport = () => {
        setShowAddAirportModal(true);
    };

    const handleEditAirport = (airport) => {
        setAirportToUpdate(airport);
        setShowUpdateAirport(true);
    };

    const handleDeleteButtonClick = (airport) => {
        setShowDeleteConfirmModal(true);
        setAirportToDelete(airport);
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setAirportToDelete(null);
    };

    const handleFetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const confirmDeleteAirport = async () => {
        setIsDeleting(true);
        try {
            const response = await adminDeleteAirport(airportToDelete._id);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleCloseDeleteConfirmModal();
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
                handleCloseDeleteConfirmModal();
            }
        } catch (error) {
            console.error(
                t('viewAirports.errors.deleteAirportFailedConsole'),
                error
            ); // Dịch thông báo lỗi
            toast.error(t('viewAirports.errors.deleteAirportFailedToast')); // Dịch thông báo lỗi
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchAirports = async () => {
        try {
            const data = await adminGetAllAirport(currentLimit, currentPage);
            if (data && data.EC === 0) {
                setAirports(data.DT.airports);
                setTotalPage(data.DT.totalPages);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.error(
                t('viewAirports.errors.fetchAirportsFailedConsole'),
                error
            ); // Dịch thông báo lỗi
            toast.error(t('viewAirports.errors.fetchAirportsFailedToast')); // Dịch thông báo lỗi
        }
    };

    useEffect(() => {
        fetchAirports();
    }, [currentPage, fetchDataAgain]);

    return (
        <div className="p-4">
            <AddAirport
                show={showAddAirportModal}
                handleClose={handleCloseAddAirportModal}
            />

            <ViewAirportDetails
                show={showDetail}
                handleClose={handleCloseDetailAirport}
                airportData={airportDetail}
            />

            <UpdateAirport
                show={showUpdateAirport}
                handleClose={handleCloseUpdateAirportModal}
                airportData={airportToUpdate}
                handleFetchDataAgain={handleFetchDataAgain}
            />

            <Modal
                show={showDeleteConfirmModal}
                onHide={handleCloseDeleteConfirmModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewAirports.deleteModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewAirports.deleteModal.confirmationText')}{' '}
                    <span className="fs-6 fw-bold">
                        {airportToDelete?.name} ({airportToDelete?.code}){' '}
                    </span>
                    {t('viewAirports.deleteModal.irrevocableText')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteAirport}
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
                                    className="me-2"
                                />
                                {t('viewAirports.buttons.deleting')}
                            </>
                        ) : (
                            t('viewAirports.buttons.delete')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteConfirmModal}
                        disabled={isDeleting}
                    >
                        {t('viewAirports.buttons.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <h4 className="mb-4">{t('viewAirports.mainTitle')}</h4>
            <Row className="mb-3 align-items-center">
                <Col md={4} className="text-start">
                    <Button
                        variant="primary"
                        className="d-flex align-items-center"
                        onClick={handleAddNewAirport}
                    >
                        <FaPlus className="me-2" />
                        <span> {t('viewAirports.buttons.addNewAirport')}</span>
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('viewAirports.tableHeaders.airportName')}</th>
                        <th>{t('viewAirports.tableHeaders.iataCode')}</th>
                        <th>{t('viewAirports.tableHeaders.country')}</th>
                        <th>{t('viewAirports.tableHeaders.province')}</th>
                        <th>{t('viewAirports.tableHeaders.timeZone')}</th>
                        <th className="text-center">
                            {t('viewAirports.tableHeaders.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {airports.length > 0 ? (
                        airports.map((airport, index) => (
                            <tr key={airport._id || index}>
                                <td>
                                    {(currentPage - 1) * currentLimit +
                                        index +
                                        1}
                                </td>
                                <td
                                    style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        maxWidth: '250px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {/* {airport.name} */}
                                    <TranslateText text={airport.name} />
                                </td>
                                <td>{airport.code}</td>
                                <td>{airport.country}</td>
                                <td>{airport.province}</td>
                                <td>{airport.time_zon}</td>
                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleViewDetailAirport(airport)
                                        }
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleEditAirport(airport)
                                        }
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(airport)
                                        }
                                        disabled={isDeleting}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                {t('viewAirports.noAirportsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 0 && (
                <div className="paginate-block d-flex justify-content-center mt-3">
                    <ReactPaginate
                        nextLabel={t('viewAirports.pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={4}
                        pageCount={totalPage}
                        previousLabel={t('viewAirports.pagination.previous')}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewAirports;
