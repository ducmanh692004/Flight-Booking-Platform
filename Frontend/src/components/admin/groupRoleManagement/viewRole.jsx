import { useEffect, useState } from 'react';
import {
    adminGetAllRole,
    adminGetAllGroup,
    adminGetAllRoleOfGroup,
    adminUpdateRoleOfGroup,
} from '../../../services/AdminService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import AddRoleModal from './addRole';
import AddGroupModal from './addGroup';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import UpdateRoleModal from './updateRole';
import DeleteRoleModal from './deleteRole';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const ViewListRole = () => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [allRole, setAllRole] = useState([]);
    const [allGroup, setAllGroup] = useState([]);
    const [showAddRole, setShowAllRole] = useState(false);
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [refreshAgain, setRefreshAgain] = useState(false);
    const [currentGroupSelected, setCurrentGroupSelected] = useState('');
    const [currentRoleofGroupData, setCurrentRoleOfGroupData] = useState([]);
    const [showUpdateRole, setShowUpdateRole] = useState(false);
    const [showDeleteRole, setShowDeleteRole] = useState(false);
    const [roleToUpdate, setRoleToUpdate] = useState(null);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const handleSetRefreshAgain = () => {
        setRefreshAgain(!refreshAgain);
    };

    const handleFetchAllRole = async () => {
        const response = await adminGetAllRole();
        if (response && response.EC === 0) {
            setAllRole(response.DT);
        } else {
            toast.error(
                response.EM || t('viewListRole.messages.errorFetchingRole')
            );
        }
    };

    const handleFetchAllGroup = async () => {
        const response = await adminGetAllGroup();
        if (response && response.EC === 0) {
            setAllGroup(response.DT);
            // Optionally set the first group as selected by default if DT is not empty
            if (response.DT.length > 0 && currentGroupSelected === '') {
                setCurrentGroupSelected(response.DT[0]._id);
            }
        } else {
            toast.error(
                response.EM || t('viewListRole.messages.errorFetchingGroup')
            );
        }
    };

    const handleAddRole = () => {
        setShowAllRole(true);
    };

    const handleCloseAddRole = () => {
        setShowAllRole(false);
    };

    const handleAddGroup = () => {
        setShowAddGroup(true);
    };

    const handleCloseAddGroup = () => {
        setShowAddGroup(false);
    };

    const handleChangeInput = (roleId) => {
        setCurrentRoleOfGroupData((prev) =>
            prev.includes(roleId)
                ? prev.filter((item) => item !== roleId)
                : [...prev, roleId]
        );
    };

    const handleUpdateRoleOfGroup = async () => {
        const response = await adminUpdateRoleOfGroup(
            currentGroupSelected,
            currentRoleofGroupData
        );
        if (response && response.EC === 0) {
            toast.success(
                response.EM ||
                    t('viewListRole.messages.updateRoleOfGroupSuccess')
            );
            handleSetRefreshAgain();
        } else {
            toast.error(
                response.EM ||
                    t('viewListRole.messages.errorUpdatingRoleOfGroup')
            );
        }
    };

    const handleUpdateRole = (role) => {
        setRoleToUpdate(role);
        setShowUpdateRole(true);
    };
    const handleCloseUpdateRole = () => {
        setShowUpdateRole(false);
        setRoleToUpdate(null);
    };

    const handleDeleteRole = (role) => {
        setShowDeleteRole(true);
        setRoleToDelete(role);
    };

    const handleCloseDeleteRole = () => {
        setShowDeleteRole(false);
        setRoleToDelete(null);
    };

    useEffect(() => {
        handleFetchAllRole();
        handleFetchAllGroup();
    }, [refreshAgain]);

    const handleTakeRoleOfGroup = async () => {
        try {
            const response = await adminGetAllRoleOfGroup(currentGroupSelected);
            if (response && response.EC === 0) {
                // Assuming response.DT is an array and we need listRoles from the first item
                setCurrentRoleOfGroupData(response.DT[0]?.listRoles || []);
            } else {
                toast.error(
                    response.EM ||
                        t('viewListRole.messages.errorGettingRoleOfGroup')
                );
                setCurrentRoleOfGroupData([]); // Clear data if error
            }
        } catch (error) {
            console.log(error);
            toast.error(t('viewListRole.messages.errorGettingRoleOfGroup'));
            setCurrentRoleOfGroupData([]); // Clear data on catch
        }
    };

    useEffect(() => {
        if (currentGroupSelected) {
            // Only fetch if a group is actually selected
            handleTakeRoleOfGroup();
        } else {
            setCurrentRoleOfGroupData([]); // Clear current roles if no group is selected
        }
    }, [currentGroupSelected, refreshAgain]); // Add refreshAgain to re-fetch when roles/groups are added/updated/deleted

    return (
        <div
            className="p-4 d-flex flex-column gap-3"
            style={{ maxHeight: '100vh' }}
        >
            {showUpdateRole && (
                <UpdateRoleModal
                    show={showUpdateRole}
                    handleClose={handleCloseUpdateRole}
                    itemData={roleToUpdate}
                    handleSetRefreshAgain={handleSetRefreshAgain}
                />
            )}

            {showDeleteRole && (
                <DeleteRoleModal
                    show={showDeleteRole}
                    handleClose={handleCloseDeleteRole}
                    itemData={roleToDelete}
                    handleSetRefreshAgain={handleSetRefreshAgain}
                />
            )}

            {showAddRole && (
                <AddRoleModal
                    show={showAddRole}
                    handleClose={handleCloseAddRole}
                    handleSetRefreshAgain={handleSetRefreshAgain}
                />
            )}

            {showAddGroup && (
                <AddGroupModal
                    show={showAddGroup}
                    handleClose={handleCloseAddGroup}
                    handleSetRefreshAgain={handleSetRefreshAgain}
                />
            )}
            <div
                className="d-flex flex-column gap-2"
                style={{ maxHeight: '10vh' }}
            >
                <h4>{t('viewListRole.title')}</h4>
                <div className="d-flex gap-2">
                    <select
                        className="form-select w-25"
                        onChange={(e) =>
                            setCurrentGroupSelected(e.target.value)
                        }
                        value={currentGroupSelected} // Ensure the selected value is bound
                    >
                        <option value="">
                            {t('viewListRole.selectGroupPlaceholder')}
                        </option>
                        {allGroup &&
                            allGroup.length > 0 &&
                            allGroup.map((item, index) => {
                                return (
                                    <option key={index} value={item._id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                    </select>
                    <Button onClick={() => handleAddRole()}>
                        {t('viewListRole.addRoleButton')}
                    </Button>
                    <Button
                        className="btn-warning"
                        onClick={() => handleAddGroup()}
                    >
                        {t('viewListRole.addGroupButton')}
                    </Button>
                </div>
            </div>

            <div
                className="d-flex flex-column gap-2 p-2 px-3"
                style={{
                    maxHeight: '72vh',
                    overflowY: 'auto',
                    backgroundColor: '#e1e1e1ff',
                }}
            >
                {allRole &&
                    allRole.length > 0 &&
                    allRole.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="d-flex justify-content-between align-items-center gap-4"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={currentRoleofGroupData.includes(
                                            item._id
                                        )}
                                        onChange={() =>
                                            handleChangeInput(item._id)
                                        }
                                    />
                                    <span className="mt-0">{item.url}</span>
                                    <span className="text-muted">
                                        ({item.name})
                                    </span>
                                </div>
                                <div className="d-flex gap-2">
                                    <FaRegEdit
                                        className="text-primary cursor-pointer"
                                        onClick={() => handleUpdateRole(item)}
                                    />
                                    <RiDeleteBinLine
                                        className="text-danger cursor-pointer"
                                        onClick={() => handleDeleteRole(item)}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="d-flex" style={{ maxHeight: '10vh' }}>
                <Button
                    onClick={() => handleUpdateRoleOfGroup()}
                    disabled={!currentGroupSelected}
                >
                    {' '}
                    {/* Disable if no group is selected */}
                    {t('viewListRole.updatePermissionsButton')}
                </Button>
            </div>
        </div>
    );
};

export default ViewListRole;
