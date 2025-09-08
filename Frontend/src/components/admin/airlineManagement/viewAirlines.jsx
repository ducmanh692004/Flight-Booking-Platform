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
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import {
    adminDeleteAirline,
    adminGetAllAirline,
} from '../../../services/AdminService';
import AddAirline from './addAirline';
import UpdateAirline from './updateAirline';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ViewAirlines = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation
    const [airlines, setAirlines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showUpdateAirline, setShowUpdateAirline] = useState(false);
    const [airlineUpdate, setAirlineUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [airlineToDelete, setAirlineToDelete] = useState(null);

    const [showAddAirlineModal, setShowAddAirlineModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(11);

    const handleCloseAddAirlineModal = () => {
        setShowAddAirlineModal(false);
    };
    const handleCloseUpdateAirlineModal = () => {
        setShowUpdateAirline(false);
    };

    const handleAddNewAirline = () => {
        setShowAddAirlineModal(true);
    };

    const handleEditAirline = (airline) => {
        setAirlineUpdate(airline);
        setShowUpdateAirline(true);
    };

    const handleDeleteButtonClick = (airline) => {
        setShowDeleteConfirmModal(true);
        setAirlineToDelete(airline);
    };

    const handleFetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const confirmDeleteAirline = async () => {
        setIsDeleting(true);

        try {
            const response = await adminDeleteAirline(airlineToDelete._id);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                setShowDeleteConfirmModal(false);
                setAirlineToDelete(null);
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
                setShowDeleteConfirmModal(false);
                setAirlineToDelete(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(t('viewAirlines.errors.deleteFailed')); // Dịch thông báo lỗi
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmModal(false);
            setAirlineToDelete(null);
        }
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setAirlineToDelete(null);
    };

    const fetchAirlines = async () => {
        try {
            const data = await adminGetAllAirline(currentLimit, currentPage);
            if (data && data.EC === 0) {
                setAirlines(data.DT.airlines);
                setTotalPage(data.DT.totalPages);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAirlines();
    }, [currentPage, fetchDataAgain]);

    return (
        <div className="p-4">
            {/* {showUpdateAirline && ( */}
            <UpdateAirline
                show={showUpdateAirline}
                handleClose={handleCloseUpdateAirlineModal}
                airlineData={airlineUpdate}
                handleRefetch={handleFetchDataAgain}
                handleFetchDataAgain={handleFetchDataAgain}
            />

            {/* {showAddAirlineModal && ( */}
            <AddAirline
                show={showAddAirlineModal}
                handleClose={handleCloseAddAirlineModal}
            />
            {/* )} */}
            <Modal
                show={showDeleteConfirmModal}
                onHide={handleCloseAddAirlineModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewAirlines.deleteConfirmModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewAirlines.deleteConfirmModal.message')}{' '}
                    <span className="fs-6 fw-bold">
                        {' '}
                        {airlineToDelete?.name}{' '}
                    </span>
                    {t('viewAirlines.deleteConfirmModal.messageSuffix')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteAirline}
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
                                {t('viewAirlines.deleteConfirmModal.deleting')}
                            </>
                        ) : (
                            t('viewAirlines.deleteConfirmModal.deleteButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleCloseDeleteConfirmModal()}
                        disabled={isDeleting}
                    >
                        {t('viewAirlines.deleteConfirmModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <h4 className="mb-4">{t('viewAirlines.title')}</h4>
            <Row className="mb-3 align-items-center">
                <Col md={4} className="text-start">
                    <Button
                        variant="primary"
                        className="d-flex align-items-center"
                        onClick={handleAddNewAirline}
                    >
                        <FaPlus className="me-2" />
                        <span> {t('viewAirlines.addNewAirlineButton')}</span>
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>{t('viewAirlines.table.colNo')}</th>
                        <th>{t('viewAirlines.table.colLogo')}</th>
                        <th>{t('viewAirlines.table.colAirlineName')}</th>
                        <th>{t('viewAirlines.table.colCountry')}</th>
                        <th className="text-center">
                            {t('viewAirlines.table.colActions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {airlines.length > 0 ? (
                        airlines.map((airline, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={airline.logo_url}
                                        alt={airline.name}
                                        style={{
                                            width: '50px',
                                            height: 'auto',
                                        }}
                                    />
                                </td>
                                <td>{airline.name}</td>
                                <td>{airline.country}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleEditAirline(airline)
                                        }
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(airline)
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
                            <td colSpan="5" className="text-center">
                                {t('viewAirlines.table.noAirlinesFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {totalPage > 0 && (
                <div className="paginate-block d-flex justify-content-center mt-3">
                    <ReactPaginate
                        nextLabel={t('pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={4}
                        pageCount={totalPage}
                        previousLabel={t('pagination.previous')}
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

export default ViewAirlines;
