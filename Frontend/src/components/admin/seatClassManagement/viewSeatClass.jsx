// src/components/Admin/SeatClass/ViewSeatClasses.jsx
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
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    adminDeleteSeatClass,
    adminGetAllSeatClass,
} from '../../../services/AdminService';
import AddSeatClass from './addSeatClass'; // GIỮ NGUYÊN ĐƯỜNG DẪN GỐC
import UpdateSeatClass from './updateSeatClass'; // GIỮ NGUYÊN ĐƯỜNG DẪN GỐC
import { TranslateText } from '../../Translate';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const ViewSeatClasses = () => {
    // Sử dụng useTranslation hook để truy cập các hàm dịch
    const { t } = useTranslation();

    const [seatClasses, setSeatClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showUpdateSeatClass, setShowUpdateSeatClass] = useState(false);
    const [seatClassToUpdate, setSeatClassToUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [seatClassToDelete, setSeatClassToDelete] = useState(null);

    const [showAddSeatClassModal, setShowAddSeatClassModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const handleCloseAddSeatClassModal = () => {
        setShowAddSeatClassModal(false);
        handleRefetchDataAgain();
    };

    const handleAddNewSeatClass = () => {
        setShowAddSeatClassModal(true);
    };

    const handleEditSeatClass = (seatClass) => {
        setSeatClassToUpdate(seatClass);
        setShowUpdateSeatClass(true);
    };

    const handleDeleteButtonClick = (seatClass) => {
        setShowDeleteConfirmModal(true);
        setSeatClassToDelete(seatClass);
    };

    const handleRefetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handleCloseUpdateSeatClassModal = () => {
        setShowUpdateSeatClass(false);
        handleRefetchDataAgain();
    };

    const confirmDeleteSeatClass = async () => {
        setIsDeleting(true);

        try {
            const response = await adminDeleteSeatClass(seatClassToDelete._id);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                setShowDeleteConfirmModal(false);
                setSeatClassToDelete(null);
                handleRefetchDataAgain();
            } else {
                toast.error(response.EM);
                setShowDeleteConfirmModal(false);
                setSeatClassToDelete(null);
            }
        } catch (error) {
            console.error('Lỗi khi xóa hạng ghế:', error);
            toast.error(t('viewSeatClasses.toastMessages.deleteError'));
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmModal(false);
            setSeatClassToDelete(null);
        }
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setSeatClassToDelete(null);
    };

    const fetchSeatClasses = async () => {
        try {
            const data = await adminGetAllSeatClass();
            if (data && data.EC === 0) {
                setSeatClasses(data.DT);
            } else {
                // Sử dụng bản dịch cho lỗi nếu có, hoặc giữ nguyên EM từ API
                toast.error(
                    data.EM || t('viewSeatClasses.toastMessages.fetchError')
                );
            }
        } catch (error) {
            console.error(error);
            toast.error(t('viewSeatClasses.toastMessages.fetchError')); // Fallback cho lỗi mạng hoặc lỗi không xác định
        }
    };

    useEffect(() => {
        fetchSeatClasses();
    }, [fetchDataAgain]);

    const filteredSeatClasses = seatClasses.filter(
        (seatClass) =>
            seatClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seatClass.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <UpdateSeatClass
                show={showUpdateSeatClass}
                handleClose={handleCloseUpdateSeatClassModal}
                seatClassData={seatClassToUpdate}
                // handleRefetch={handleRefetchDataAgain}
            />

            <AddSeatClass
                show={showAddSeatClassModal}
                handleClose={handleCloseAddSeatClassModal}
                // handleRefetch={handleRefetchDataAgain}
            />

            <Modal
                show={showDeleteConfirmModal}
                onHide={handleCloseDeleteConfirmModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewSeatClasses.deleteConfirmModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewSeatClasses.deleteConfirmModal.messagePart1')}{' '}
                    <span className="fs-6 fw-bold">
                        {/* {seatClassToDelete?.name} */}
                        <TranslateText text={seatClassToDelete?.name} />
                    </span>{' '}
                    {t('viewSeatClasses.deleteConfirmModal.messagePart2')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteSeatClass}
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
                                {t(
                                    'viewSeatClasses.deleteConfirmModal.deletingButton'
                                )}
                            </>
                        ) : (
                            t('viewSeatClasses.deleteConfirmModal.deleteButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteConfirmModal}
                        disabled={isDeleting}
                    >
                        {t('viewSeatClasses.deleteConfirmModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <h4 className="mb-4">{t('viewSeatClasses.title')}</h4>
            <Row className="mb-3 align-items-center">
                <Col md={4} className="text-start">
                    <Button
                        variant="primary"
                        className="d-flex align-items-center"
                        onClick={handleAddNewSeatClass}
                    >
                        <FaPlus className="me-2" />
                        <span> {t('viewSeatClasses.addNewSeatClass')}</span>
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>{t('viewSeatClasses.tableHeaders.stt')}</th>
                        <th>{t('viewSeatClasses.tableHeaders.name')}</th>
                        <th>{t('viewSeatClasses.tableHeaders.description')}</th>
                        <th className="text-center">
                            {t('viewSeatClasses.tableHeaders.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSeatClasses.length > 0 ? (
                        filteredSeatClasses.map((seatClass, index) => (
                            <tr key={seatClass._id}>
                                <td>{index + 1}</td>
                                <td>
                                    {/* {seatClass.name} */}
                                    <TranslateText text={seatClass.name} />
                                </td>
                                <td>
                                    {/* {seatClass.description} */}
                                    <TranslateText
                                        text={seatClass.description}
                                    />
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleEditSeatClass(seatClass)
                                        }
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(seatClass)
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
                            <td colSpan="4" className="text-center">
                                {t('viewSeatClasses.noSeatClassesFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* Phân trang đã bị loại bỏ */}
        </div>
    );
};

export default ViewSeatClasses;
