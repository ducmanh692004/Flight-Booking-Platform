import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import {
    adminGetSupport,
    adminDeleteSupport,
} from '../../services/AdminService';
import { FaEye, FaTrash } from 'react-icons/fa'; // Bỏ FaEdit, FaPlus, FaSearch nếu không dùng
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ViewSupportRequests = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation
    const [supports, setSupports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailSupport, setDetailSupport] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [supportToDelete, setSupportToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);

    // Lấy danh sách hỗ trợ với phân trang
    const fetchSupports = async () => {
        try {
            const res = await adminGetSupport(limit, currentPage);
            if (res && res.EC === 0) {
                setSupports(res.DT.data);
                setTotalPages(res.DT.totalPage);
            } else {
                toast.error(res.EM || t('supportRequests.errorLoadingList'));
            }
        } catch (err) {
            console.error(err);
            toast.error(t('supportRequests.errorCallingApi'));
        }
    };

    useEffect(() => {
        fetchSupports();
    }, [currentPage, refreshToggle]);

    const handleViewDetail = (support) => {
        setDetailSupport(support);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setDetailSupport(null);
    };

    const handleDeleteClick = (support) => {
        setSupportToDelete(support);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!supportToDelete) return;
        setIsDeleting(true);
        try {
            const res = await adminDeleteSupport(supportToDelete._id);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                setRefreshToggle((prev) => !prev);
            } else {
                toast.error(res.EM || t('supportRequests.deleteFailed'));
            }
        } catch (err) {
            console.error(err);
            toast.error(t('supportRequests.errorDeletingRequest'));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setSupportToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSupportToDelete(null);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    return (
        <div className="p-4">
            <h4 className="mb-4">{t('supportRequests.pageTitle')}</h4>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('supportRequests.tableHeader.dateCreated')}</th>
                        <th>{t('supportRequests.tableHeader.contactEmail')}</th>
                        <th>{t('supportRequests.tableHeader.content')}</th>
                        <th className="text-center">
                            {t('supportRequests.tableHeader.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {supports.length > 0 ? (
                        supports.map((sup, idx) => (
                            <tr key={sup._id}>
                                <td>{(currentPage - 1) * limit + idx + 1}</td>
                                <td>
                                    {new Date(sup.createdAt).toLocaleString()}
                                </td>
                                <td>{sup.emailContact || '-'}</td>
                                <td
                                    className="text-truncate"
                                    style={{ maxWidth: '200px' }}
                                >
                                    {sup.content}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleViewDetail(sup)}
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(sup)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                            />
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                {t('supportRequests.noRequestsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <ReactPaginate
                        pageCount={totalPages}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName="pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        activeClassName="active"
                        previousLabel="‹"
                        nextLabel="›"
                    />
                </div>
            )}

            {/* Modal Chi tiết */}
            <Modal show={showDetailModal} onHide={handleCloseDetail} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t('supportRequests.detailModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>
                            {t('supportRequests.detailModal.contactEmail')}:
                        </strong>{' '}
                        {detailSupport?.emailContact || '-'}
                    </p>
                    <p>
                        <strong>
                            {t('supportRequests.detailModal.content')}:
                        </strong>
                    </p>
                    <p>{detailSupport?.content}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetail}>
                        {t('supportRequests.detailModal.closeButton')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('supportRequests.deleteModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('supportRequests.deleteModal.confirmationText')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            t('supportRequests.deleteModal.deleteButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCancelDelete}
                        disabled={isDeleting}
                    >
                        {t('supportRequests.deleteModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ViewSupportRequests;
