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
    Spinner, // Import Spinner từ react-bootstrap
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import {
    adminDeleteUser,
    adminGetAllUser,
} from '../../../services/AdminService';
import { toast } from 'react-toastify';
import UserDetailModal from './viewUserDetail';
import UserUpdateFormModal from './updateUser';
import AddUserModal from './addUser';
import { set } from 'lodash';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const ViewUsers = () => {
    // Sử dụng useTranslation hook để truy cập các hàm dịch
    const { t } = useTranslation();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showViewUser, setShowViewUser] = useState(false);
    const [userView, setUserView] = useState(null);

    const [showUpdateUser, setShowUpdateUser] = useState(false);
    const [userUpdate, setUserUpdate] = useState(null);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [showAddUserModal, setShowAddUserModal] = useState(false);

    // State để quản lý trạng thái loading
    const [isDeleting, setIsDeleting] = useState(false);

    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const handleFetchDataAgain = () => {
        setFetchDataAgain((prev) => !prev);
    };

    const handleCloseViewUser = () => {
        setShowViewUser(false);
        setUserView(null);
    };

    const handleCloseUpdateUser = () => {
        setShowUpdateUser(false);
        setUserUpdate(null);
        handleFetchDataAgain();
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setUserToDelete(null);
    };

    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        // handleFetchDataAgain();
    };

    const handleFetchUser = async () => {
        try {
            const response = await adminGetAllUser();
            if (response && response.EC === 0) {
                setUsers(response.DT);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            toast.error(t('viewUsers.toastMessages.fetchUsersError'));
        }
    };

    useEffect(() => {
        handleFetchUser();
    }, [fetchDataAgain]);

    const handleViewDetails = (user) => {
        setUserView(user);
        setShowViewUser(true);
    };

    const handleEditUser = (user) => {
        setUserUpdate(user);
        setShowUpdateUser(true);
    };

    const handleDeleteButtonClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        // Bắt đầu quá trình loading và đóng modal xác nhận
        setIsDeleting(true);
        handleCloseDeleteConfirmModal();

        // Đã điều chỉnh thành 2 giây
        const MIN_LOADING_TIME = 2000; // 2 giây
        const startTime = Date.now();

        try {
            const response = await adminDeleteUser(userToDelete._id);

            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            const remainingTime = MIN_LOADING_TIME - elapsedTime;

            // Chờ thêm nếu thời gian phản hồi API quá nhanh
            if (remainingTime > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, remainingTime)
                );
            }

            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API xóa người dùng:', error);
            toast.error(t('viewUsers.toastMessages.deleteApiError'));
        } finally {
            // Dừng loading dù API thành công hay thất bại
            setIsDeleting(false);
        }
    };

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };

    const handleSaveUser = (userData) => {
        // Logic để gửi userData lên API thêm/cập nhật
        // Sau đó gọi handleFetchDataAgain();
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.fullname &&
                user.fullname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (user.email &&
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phone &&
                user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-4">
            {showUpdateUser && (
                <UserUpdateFormModal
                    show={showUpdateUser}
                    handleClose={handleCloseUpdateUser}
                    user={userUpdate}
                    handleFetchDataAgain={handleFetchDataAgain}
                />
            )}

            {showViewUser && (
                <UserDetailModal
                    show={showViewUser}
                    handleClose={handleCloseViewUser}
                    user={userView}
                />
            )}

            {showAddUserModal && (
                <AddUserModal
                    show={showAddUserModal}
                    handleClose={handleCloseAddUserModal}
                    handleFetchDataAgain={handleFetchDataAgain}
                />
            )}

            {/* Modal Xác nhận Xóa */}
            <Modal
                show={showDeleteConfirmModal}
                onHide={handleCloseDeleteConfirmModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        {t('viewUsers.deleteConfirmationModal.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('viewUsers.deleteConfirmationModal.messagePart1')}{' '}
                    <span className="fs-6 fw-bold">
                        {' '}
                        {userToDelete?.fullname}{' '}
                    </span>
                    {t('viewUsers.deleteConfirmationModal.messagePart2')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteUser}
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
                                {t('viewUsers.buttons.deleting')}
                            </>
                        ) : (
                            t('viewUsers.buttons.delete')
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteConfirmModal}
                        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
                    >
                        {t('viewUsers.buttons.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal hiển thị khi đang xóa (loading) */}
            <Modal
                show={isDeleting}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body className="text-center py-4">
                    <Spinner
                        animation="border"
                        role="status"
                        className="mb-3"
                    />
                    <h4>
                        {t('viewUsers.deleteConfirmationModal.deletingUser')}
                    </h4>
                    <p>{t('viewUsers.deleteConfirmationModal.pleaseWait')}</p>
                </Modal.Body>
            </Modal>

            <h4 className="mb-4">{t('viewUsers.title')}</h4>
            <Row className="mb-3 align-items-center">
                <Col md={4} className="text-start">
                    <Button variant="primary" onClick={handleAddUser}>
                        <FaPlus className="me-2" />
                        {t('viewUsers.buttons.addNewUser')}
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th>{t('viewUsers.tableHeaders.stt')}</th>
                        <th>{t('viewUsers.tableHeaders.userName')}</th>
                        <th>{t('viewUsers.tableHeaders.email')}</th>
                        <th>{t('viewUsers.tableHeaders.phone')}</th>
                        <th className="text-center">
                            {t('viewUsers.tableHeaders.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <tr key={user._id || index}>
                                <td>{index + 1}</td>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                <td>
                                    {' '}
                                    {user.phone
                                        ? user.phone
                                        : t('viewUsers.noPhoneNumber')}
                                </td>

                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleViewDetails(user)}
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteButtonClick(user)
                                        }
                                        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                {t('viewUsers.noUsersFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ViewUsers;
