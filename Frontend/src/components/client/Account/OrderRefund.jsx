import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userGetRefundOrder } from '../../../services/OrderService';
import { toast } from 'react-toastify';
import {
    Container,
    Table,
    Alert,
    Spinner,
    Card,
    Badge,
    Button,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { useFormatter } from '../../hooks/useFomatter';
import OrderDetail from '../Payment/PaymentOrder/DetailOrderInformation';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../Translate';

const OrderRefund = () => {
    const [listAllRefundOrders, setListAllRefundOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailOrder, setShowDetailOrder] = useState(false);
    const [orderIdSelected, setOrderIdSelected] = useState(null);
    const { formatCurrency } = useFormatter();
    const userId = useSelector((state) => state.user.account.id);

    const { t } = useTranslation();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userGetRefundOrder(userId);

            if (response && response.EC === 0) {
                setListAllRefundOrders(response.DT);
            } else {
                toast.error(
                    response.EM || 'Có lỗi xảy ra khi lấy dữ liệu hoàn tiền.'
                );
            }
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu hoàn tiền:', error);
            toast.error('Không thể kết nối đến máy chủ hoặc có lỗi.');
        } finally {
            setLoading(false);
        }
    };

    const handleHideOrderDetail = () => {
        setShowDetailOrder(false);
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleViewOrderDetail = (orderId) => {
        setOrderIdSelected(orderId);
        setShowDetailOrder(true);
    };

    const renderRefundTable = (orders) => {
        if (loading) {
            return (
                <div className="text-center my-4">
                    <Spinner
                        animation="border"
                        role="status"
                        className="mb-2"
                    />
                    <p>{t('orderRefund.loading')}</p>
                </div>
            );
        }

        if (!orders || orders.length === 0) {
            return (
                <Alert variant="info" className="text-center my-4">
                    {t('orderRefund.noData')}
                </Alert>
            );
        }

        return (
            <Table striped bordered hover responsive className="shadow-sm mt-2">
                <OrderDetail
                    orderId={orderIdSelected}
                    onHide={handleHideOrderDetail}
                    show={showDetailOrder}
                />
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('orderRefund.tableHeaders.orderCode')}</th>
                        <th>{t('orderRefund.tableHeaders.refundAmount')}</th>
                        <th>{t('orderRefund.tableHeaders.status')}</th>
                        <th>{t('orderRefund.tableHeaders.time')}</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.orderId}</td>
                            <td>
                                {formatCurrency(
                                    order.refundMoney.$numberDecimal
                                )}
                            </td>
                            <td>
                                <Badge
                                    bg={
                                        order.status === 'Đang chờ hoàn tiền'
                                            ? 'warning'
                                            : order.status === 'Đã hoàn tiền'
                                            ? 'success'
                                            : 'secondary'
                                    }
                                    text={
                                        order.status === 'Đang chờ hoàn tiền'
                                            ? 'dark'
                                            : 'white'
                                    }
                                >
                                    {/* {order.status} */}
                                    <TranslateText text={order.status} />
                                </Badge>
                            </td>
                            <td>
                                {dayjs(order.createdAt).format(
                                    'DD/MM/YYYY HH:mm'
                                )}
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                        handleViewOrderDetail(order.orderId)
                                    }
                                >
                                    {t('orderRefund.detailsButton')}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    return (
        <div>
            <h5>{t('orderRefund.title')}</h5>
            <hr style={{ marginTop: '48px' }}></hr>
            {renderRefundTable(listAllRefundOrders)}{' '}
        </div>
    );
};

export default OrderRefund;
