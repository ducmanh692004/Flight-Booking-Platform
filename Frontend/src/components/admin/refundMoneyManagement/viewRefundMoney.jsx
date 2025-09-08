import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa'; // FaCheck and FaTimes are not used in the original logic, kept them as is
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import {
    adminGetRefundRequests,
    adminProcessRefund,
    adminIgnoreRefund,
} from '../../../services/AdminService';
import { useFormatter } from '../../hooks/useFomatter';
import { getDateOnly } from '../../../utils/myFunction';
import { MdOutlineCancel } from 'react-icons/md';
import { RiRefund2Line } from 'react-icons/ri';
import { TranslateText } from '../../Translate';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const ViewRefundRequests = () => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [refunds, setRefunds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [processingRefundId, setProcessingRefundId] = useState(null); // Not used in original logic, kept as is
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedRefundAction, setSelectedRefundAction] = useState(null); // { id, action }
    const [isConfirming, setIsConfirming] = useState(false);

    const { formatCurrency } = useFormatter();

    const fetchRefunds = async () => {
        setIsLoading(true);
        try {
            const res = await adminGetRefundRequests(currentLimit, currentPage);
            if (res && res.EC === 0) {
                setRefunds(res.DT.refunds);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error(
                    res.EM || t('viewRefundRequests.toastMessages.fetchError')
                );
            }
        } catch (err) {
            toast.error(
                t('viewRefundRequests.toastMessages.serverConnectError')
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleOpenConfirmModal = (refund, actionType) => {
        setSelectedRefundAction({ id: refund._id, action: actionType });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedRefundAction) return;
        const { id, action } = selectedRefundAction;

        setIsConfirming(true);

        try {
            const res =
                action === 'approve'
                    ? await adminProcessRefund(id)
                    : await adminIgnoreRefund(id);

            if (res && res.EC === 0) {
                toast.success(res.EM); // Keep original EM from server for specific success messages
                fetchRefunds();
                setShowConfirmModal(false);
            } else {
                toast.error(res.EM); // Keep original EM from server for specific error messages
                setShowConfirmModal(false);
            }
        } catch (err) {
            toast.error(
                t('viewRefundRequests.toastMessages.serverProcessError')
            );
        } finally {
            setIsConfirming(false);
            setSelectedRefundAction(null);
            setShowConfirmModal(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, [currentPage]);

    return (
        <div className="p-4">
            <h4 className="mb-4">{t('viewRefundRequests.title')}</h4>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>{t('viewRefundRequests.tableHeaders.stt')}</th>
                        <th>{t('viewRefundRequests.tableHeaders.reason')}</th>
                        <th>{t('viewRefundRequests.tableHeaders.note')}</th>
                        <th>
                            {t('viewRefundRequests.tableHeaders.refundAmount')}
                        </th>
                        <th>{t('viewRefundRequests.tableHeaders.status')}</th>
                        <th>
                            {t('viewRefundRequests.tableHeaders.requestDate')}
                        </th>
                        <th className="text-center">
                            {t('viewRefundRequests.tableHeaders.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? ( // Added loading state for table
                        <tr>
                            <td colSpan="7" className="text-center">
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Loading...
                            </td>
                        </tr>
                    ) : refunds.length > 0 ? (
                        refunds.map((refund, index) => (
                            <tr key={refund._id}>
                                <td>
                                    {index +
                                        1 +
                                        (currentPage - 1) * currentLimit}
                                </td>
                                <td>
                                    {/* {refund.reason} */}
                                    <TranslateText text={refund.reason} />
                                </td>
                                <td>{refund.note || '-'}</td>
                                <td>
                                    {formatCurrency(
                                        refund.refundMoney.$numberDecimal
                                    )}
                                </td>
                                <td>
                                    <span
                                        style={{ fontSize: '14px' }}
                                        className={
                                            refund.status ===
                                            t(
                                                'viewRefundRequests.status.pending'
                                            ) // Translated status
                                                ? 'bg-primary text-white p-1 rounded'
                                                : refund.status ===
                                                  t(
                                                      'viewRefundRequests.status.refunded'
                                                  ) // Translated status
                                                ? 'bg-success text-white p-1 rounded'
                                                : refund.status ===
                                                  t(
                                                      'viewRefundRequests.status.rejected'
                                                  ) // Translated status
                                                ? 'bg-danger text-white p-1 rounded'
                                                : ''
                                        }
                                    >
                                        {/* Logic for displaying status based on actual status string from backend */}
                                        {
                                            refund.status ===
                                            'Đang chờ hoàn tiền'
                                                ? t(
                                                      'viewRefundRequests.status.pending'
                                                  )
                                                : refund.status ===
                                                  'Đã hoàn tiền'
                                                ? t(
                                                      'viewRefundRequests.status.refunded'
                                                  )
                                                : refund.status === 'Đã từ chối'
                                                ? t(
                                                      'viewRefundRequests.status.rejected'
                                                  )
                                                : refund.status // Fallback if status is unknown
                                        }
                                    </span>
                                </td>
                                <td>{getDateOnly(refund.createdAt)}</td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center">
                                        {/* Original logic, no changes */}
                                        {refund.status ===
                                        'Đang chờ hoàn tiền' ? (
                                            <div className="d-flex gap-1">
                                                <Button
                                                    size="sm"
                                                    className="d-flex justify-content-center align-items-center btn-success"
                                                    onClick={() =>
                                                        handleOpenConfirmModal(
                                                            refund,
                                                            'approve'
                                                        )
                                                    }
                                                >
                                                    <RiRefund2Line className="me-1 fs-5" />
                                                    <span>
                                                        {t(
                                                            'viewRefundRequests.actionButtons.refund'
                                                        )}
                                                    </span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="d-flex justify-content-center align-items-center btn-danger"
                                                    onClick={() =>
                                                        handleOpenConfirmModal(
                                                            refund,
                                                            'reject'
                                                        )
                                                    }
                                                >
                                                    <MdOutlineCancel className="me-1 fs-5" />
                                                    <span>
                                                        {t(
                                                            'viewRefundRequests.actionButtons.reject'
                                                        )}
                                                    </span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">
                                {t('viewRefundRequests.noRequestsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 1 && (
                <div className="paginate-block d-flex justify-content-center mt-3">
                    <ReactPaginate
                        nextLabel={t('viewRefundRequests.pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={totalPage}
                        previousLabel={t(
                            'viewRefundRequests.pagination.previous'
                        )}
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

            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t('viewRefundRequests.confirmModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewRefundRequests.confirmModal.bodyPart1')}{' '}
                    <strong>
                        {selectedRefundAction?.action === 'approve'
                            ? t('viewRefundRequests.confirmModal.approveText')
                            : t('viewRefundRequests.confirmModal.rejectText')}
                    </strong>{' '}
                    {t('viewRefundRequests.confirmModal.bodyPart2')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={
                            selectedRefundAction?.action === 'approve'
                                ? 'success'
                                : 'danger'
                        }
                        onClick={handleConfirmAction}
                        disabled={isConfirming}
                    >
                        {isConfirming ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                {t(
                                    'viewRefundRequests.confirmModal.confirmingButton'
                                )}
                            </>
                        ) : (
                            t('viewRefundRequests.confirmModal.confirmButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmModal(false)}
                        disabled={isConfirming}
                    >
                        {t('viewRefundRequests.confirmModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ViewRefundRequests;
