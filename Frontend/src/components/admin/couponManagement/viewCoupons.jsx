// src/components/Admin/Coupon/ViewCoupons.jsx
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
import ReactPaginate from 'react-paginate';
import {
    adminDeleteCoupon,
    adminGetAllCoupons,
} from '../../../services/AdminService';
import AddCoupon from './addCoupon'; // Giữ nguyên cách import của bạn
import UpdateCoupon from './updateCoupon'; // Giữ nguyên cách import của bạn
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ViewCoupons = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showUpdateCoupon, setShowUpdateCoupon] = useState(false);
    const [couponUpdate, setCouponUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);

    const [showAddCouponModal, setShowAddCouponModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(10); // Adjust limit as needed

    const { formatCurrency } = useFormatter();

    const handleCloseAddCouponModal = () => {
        setShowAddCouponModal(false);
        handleFetchDataAgain(); // Refetch data after adding
    };
    const handleCloseUpdateCouponModal = () => {
        setShowUpdateCoupon(false);
        handleFetchDataAgain(); // Refetch data after updating
    };

    const handleAddNewCoupon = () => {
        setShowAddCouponModal(true);
    };

    const handleEditCoupon = (coupon) => {
        setCouponUpdate(coupon);
        setShowUpdateCoupon(true);
    };

    const handleDeleteButtonClick = (coupon) => {
        setShowDeleteConfirmModal(true);
        setCouponToDelete(coupon);
    };

    const handleFetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const confirmDeleteCoupon = async () => {
        setIsDeleting(true);

        try {
            const response = await adminDeleteCoupon(couponToDelete._id);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                setShowDeleteConfirmModal(false);
                setCouponToDelete(null);
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
                setShowDeleteConfirmModal(false);
                setCouponToDelete(null);
            }
        } catch (error) {
            console.error(
                t('viewCoupons.errors.deleteCouponFailedConsole'),
                error
            );
            toast.error(t('viewCoupons.errors.deleteCouponFailedToast'));
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmModal(false);
            setCouponToDelete(null);
        }
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setCouponToDelete(null);
    };

    const fetchCoupons = async () => {
        try {
            const data = await adminGetAllCoupons(currentLimit, currentPage);
            if (data && data.EC === 0) {
                setCoupons(data.DT.coupons);
                setTotalPage(data.DT.totalPages);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('viewCoupons.errors.fetchCouponsFailed'));
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [currentPage, fetchDataAgain, currentLimit]);

    // Optional: client-side search (if not handled by API)
    const filteredCoupons = coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <UpdateCoupon
                show={showUpdateCoupon}
                handleClose={handleCloseUpdateCouponModal}
                couponData={couponUpdate}
                handleRefetch={handleFetchDataAgain}
            />

            <AddCoupon
                show={showAddCouponModal}
                handleClose={handleCloseAddCouponModal}
                handleRefetch={handleFetchDataAgain}
            />

            <Modal
                show={showDeleteConfirmModal}
                onHide={handleCloseDeleteConfirmModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewCoupons.deleteModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewCoupons.deleteModal.body', {
                        code: couponToDelete?.code,
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteCoupon}
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
                                {t('viewCoupons.buttons.deleting')}
                            </>
                        ) : (
                            t('viewCoupons.buttons.delete')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteConfirmModal}
                        disabled={isDeleting}
                    >
                        {t('viewCoupons.buttons.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <h4 className="mb-4">{t('viewCoupons.title')}</h4>
            <Row className="mb-3 align-items-center">
                <Col md={4} className="text-start">
                    <Button
                        variant="primary"
                        className="d-flex align-items-center"
                        onClick={handleAddNewCoupon}
                    >
                        <FaPlus className="me-2" />
                        <span> {t('viewCoupons.buttons.addNewCoupon')}</span>
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('viewCoupons.table.percentCol')}</th>
                        <th>{t('viewCoupons.table.codeCol')}</th>
                        <th>{t('viewCoupons.table.maxDiscountCol')}</th>
                        <th>{t('viewCoupons.table.minOrderPriceCol')}</th>
                        <th className="text-center">
                            {t('viewCoupons.table.actionsCol')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCoupons.length > 0 ? (
                        filteredCoupons.map((coupon, index) => (
                            <tr key={coupon._id}>
                                <td>
                                    {index +
                                        1 +
                                        (currentPage - 1) * currentLimit}
                                </td>
                                <td>{coupon.percent}%</td>
                                <td>{coupon.code}</td>
                                <td>
                                    {formatCurrency(coupon.maximum_discount)}
                                </td>
                                <td>{formatCurrency(coupon.minimum_price)}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditCoupon(coupon)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(coupon)
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
                            <td colSpan="6" className="text-center">
                                {t('viewCoupons.table.noCouponsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {totalPage > 0 && (
                <div className="paginate-block d-flex justify-content-center mt-3">
                    <ReactPaginate
                        nextLabel={t('viewCoupons.pagination.next')}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={4}
                        pageCount={totalPage}
                        previousLabel={t('viewCoupons.pagination.previous')}
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

export default ViewCoupons;
