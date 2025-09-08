import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import { FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import {
    adminDeleteOrder,
    adminGetOrder,
} from '../../../services/AdminService';
import { useFormatter } from '../../hooks/useFomatter';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getDateOnly } from '../../../utils/myFunction';
import OrderDetail from '../../client/Payment/PaymentOrder/DetailOrderInformation';
import { TranslateText } from '../../Translate';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const ViewOrderr = () => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [orders, setOrders] = useState([]);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(10);
    const [orderIdShow, setOrderIdShow] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    // Khởi tạo với một trong các giá trị tiếng Anh hoặc 'all'
    const [currentStatus, setCurrentStatus] = useState('payment_success'); // Mặc định hiển thị "Tất cả"

    const { formatCurrency } = useFormatter();

    const fetchOrders = async () => {
        try {
            const res = await adminGetOrder(
                currentLimit,
                currentPage,
                currentStatus // Truyền trực tiếp giá trị tiếng Anh hoặc chuỗi rỗng
            );
            if (res && res.EC === 0) {
                setOrders(res.DT.dataOrder);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error(
                    res.EM || t('viewOrder.toastMessages.fetchOrdersError')
                );
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách đơn hàng:', error);
            toast.error(t('viewOrder.toastMessages.fetchOrdersError'));
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, fetchAgain, currentStatus]);

    const handleViewDetailOrder = (orderId) => {
        setShowOrderDetail(true);
        setOrderIdShow(orderId);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleDeleteOrder = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    const confirmDeleteOrder = async () => {
        setIsDeleting(true);
        try {
            const response = await adminDeleteOrder(orderToDelete._id);
            if (response && response.EC === 0) {
                toast.success(
                    response.EM ||
                        t('viewOrder.toastMessages.deleteOrderSuccess')
                );
                setShowDeleteModal(false);
                setOrderToDelete(null);
                setFetchAgain(!fetchAgain);
            } else {
                toast.error(
                    response.EM || t('viewOrder.toastMessages.deleteOrderError')
                );
                setShowDeleteModal(false);
                setOrderToDelete(null);
            }
        } catch (err) {
            toast.error(t('viewOrder.toastMessages.somethingWentWrong'));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="p-4">
            {showOrderDetail && (
                <OrderDetail
                    show={showOrderDetail}
                    onHide={() => setShowOrderDetail(false)}
                    orderId={orderIdShow}
                />
            )}

            <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewOrder.deleteModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('viewOrder.deleteModal.body')}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteOrder}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                {t('viewOrder.deleteModal.deletingButton')}
                            </>
                        ) : (
                            t('viewOrder.deleteModal.deleteButton')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteModal}
                        disabled={isDeleting}
                    >
                        {t('viewOrder.deleteModal.cancelButton')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <h4 className="mb-4">{t('viewOrder.title')}</h4>

            <div>
                <Tabs
                    activeKey={currentStatus}
                    onSelect={(selectedKey) => {
                        setCurrentStatus(selectedKey);
                        setCurrentPage(1);
                    }}
                    id="order-status-tabs"
                    className="mb-4"
                >
                    <Tab
                        eventKey="payment_success"
                        title={t('viewOrder.statusTabs.paymentSuccess')}
                    ></Tab>
                    <Tab
                        eventKey="payment_pending"
                        title={t('viewOrder.statusTabs.paymentPending')}
                    ></Tab>
                    <Tab
                        eventKey="refund_success"
                        title={t('viewOrder.statusTabs.refundSuccess')}
                    ></Tab>
                </Tabs>
            </div>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>{t('viewOrder.tableHeaders.stt')}</th>
                        <th>{t('viewOrder.tableHeaders.customer')}</th>
                        <th>{t('viewOrder.tableHeaders.journey')}</th>
                        <th>{t('viewOrder.tableHeaders.totalAmount')}</th>
                        <th>{t('viewOrder.tableHeaders.orderDate')}</th>
                        <th>{t('viewOrder.tableHeaders.paymentMethod')}</th>
                        <th className="text-center">
                            {t('viewOrder.tableHeaders.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>
                                    {index +
                                        1 +
                                        (currentPage - 1) * currentLimit}
                                </td>
                                <td>{order.formData.email}</td>
                                <td>
                                    {
                                        order.flightDepartureId.segments[0]
                                            .departure_airport_id.province
                                    }{' '}
                                    -{' '}
                                    {
                                        order.flightDepartureId.segments[
                                            order.flightDepartureId.segments
                                                .length - 1
                                        ].arrival_airport_id.province
                                    }{' '}
                                    {order.flightComebackId ? (
                                        <span>
                                            {t(
                                                'viewOrder.journeyTypes.roundTrip'
                                            )}
                                        </span>
                                    ) : (
                                        <span>
                                            {t('viewOrder.journeyTypes.oneWay')}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {formatCurrency(
                                        Number(
                                            order.totalFlightDeparturePrice
                                                .$numberDecimal
                                        ) +
                                            Number(
                                                order.totalFlightComebackPrice
                                                    .$numberDecimal
                                            ) +
                                            Number(
                                                order.totalBaggagePrice
                                                    .$numberDecimal
                                            ) +
                                            Number(
                                                order.totalSeatDetailPrice
                                                    .$numberDecimal
                                            ) -
                                            Number(
                                                order.discountValue
                                                    .$numberDecimal
                                            )
                                    )}
                                </td>
                                <td>{getDateOnly(order.createdAt)}</td>
                                <td>
                                    {/* {order.paymentMethod} */}
                                    <TranslateText text={order.paymentMethod} />
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleViewDetailOrder(order._id)
                                        }
                                    >
                                        <FaEye />
                                    </Button>
                                    {/* PHẦN NÀY ĐÃ ĐƯỢC ĐƯA VỀ LOGIC GỐC CỦA BẠN */}
                                    {order.status === 'Chờ thanh toán' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteOrder(order)
                                            }
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}

                                    {/* KẾT THÚC PHẦN ĐƯA VỀ LOGIC GỐC */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                {t('viewOrder.noOrdersFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <ReactPaginate
                        nextLabel={t('viewOrder.pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={totalPage}
                        previousLabel={t('viewOrder.pagination.previous')}
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

export default ViewOrderr;
