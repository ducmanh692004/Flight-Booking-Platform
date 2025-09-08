// import { checkEmailFound, hashUserPassword } from './authApiService.js';
import authApiService from './authApiService.js';
import functionAuth from './authApiService.js';
import { createJWT, createRefreshJWT } from '../middleware/jwtAction.js';
import User from '../models/user.js';
import Group from '../models/group.js';
import Role from '../models/role.js';
import Cart from '../models/cart.js';
// import { create } from 'lodash';
// import {
//     createOtpRegister,
//     hadnleConfirmOtpRegister,
// } from './otpApiService.js';
import otpApiService from './otpApiService.js';

const takeGroupInformation = async (groupId) => {
    try {
        let dataGroup = await Group.findById(groupId).populate({
            path: 'listRoles',
            model: 'Role',
            select: 'name',
        });
        // console.log('kkkkkkg', dataGroup);
        return dataGroup.listRoles;
    } catch (error) {
        console.log('check error: ', error);
    }
};

const handleLogin = async (email, password) => {
    try {
        const userData = await authApiService.checkEmailFound(email);
        if (userData) {
            // console.log('check', password);
            // console.log('check', userData.password);
            if (!userData.password) {
                return {
                    EM: 'Your account was registered by google please login by google',
                    EC: 1,
                    DT: [],
                };
            } else if (
                await functionAuth.checkPassword(password, userData.password)
            ) {
                // let dataRoles = getGroupWithRole()           // authorization
                let dataGroup = await takeGroupInformation(userData.groupId);
                let payload = {
                    id: userData._id,
                    email: userData.email,
                    fullname: userData.fullname,
                    password: userData?.password || '',
                    groupWithRoles: dataGroup,
                };

                const token = await createJWT(payload);
                const refresh_token = await createRefreshJWT({
                    id: userData._id,
                    email: userData.email,
                    fullname: userData.fullname,
                });
                // console.log('check token: ', token);
                return {
                    EM: 'Login successfully!',
                    EC: 0,
                    DT: {
                        refresh_token: refresh_token,
                        dataUser: {
                            access_token: token,
                            id: userData._id,
                            email: userData.email,
                            fullname: userData.fullname,
                            phone: userData.phone || '',
                            sex: userData.sex || '',
                            address: userData.address || '',
                            image: userData.image || '',
                            birthDay: userData.birthDay || '',
                            group: userData.groupId.name,
                        },
                    },
                };
            } else {
                return {
                    EM: 'Your password is invalid!',
                    EC: 1,
                    DT: [],
                };
            }
        } else {
            return {
                EM: 'Your email is not found!',
                EC: 1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleRegister = async (email, password, fullname) => {
    try {
        if (password === '' || email === '' || fullname === '') {
            return {
                EM: 'Your information to register is invalid!',
                EC: 1,
                DT: [],
            };
        }

        let data = await authApiService.checkEmailFound(email);
        if (data) {
            return {
                EM: 'Your email is already registered!',
                EC: 1,
                DT: [],
            };
        }

        const result = await otpApiService.createOtpRegister(
            email,
            password,
            fullname
        );
        if (result) {
            return {
                EM: 'Confirm otp in your email!',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'Something wrong in register process!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleConfirmOtpRegister = async (email, otp) => {
    try {
        // console.log('check otp: ', otp);
        const data = await otpApiService.hadnleConfirmOtpRegister(otp, email);
        if (data && data.EC !== 0) {
            // console.log('check data: ', data.EM);
            return {
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            };
        } else {
            const userData = data.DT;
            let groupId = await Group.findOne({ name: 'client' });

            const hashedPass = await authApiService.hashUserPassword(
                userData.password
            );
            // console.log('check data user: ', userData);
            const userCreate = await User.create({
                email: userData.email,
                fullname: userData.fullname,
                password: hashedPass,
                groupId: groupId._id,
            });

            await Cart.create({ user_id: userCreate._id });

            return {
                EM: 'Register account successfully!',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleCheckHavePassword = async (userId, email) => {
    try {
        let data = await User.findOne({ _id: userId, email: email });
        if (!data.password) {
            if (data) {
                return {
                    EM: 'User do not have password!',
                    EC: 1,
                    DT: 'no',
                };
            }
        } else {
            return {
                EM: 'User have password!',
                EC: 0,
                DT: 'yes',
            };
        }
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleAddPassword = async (userId, email, password) => {
    try {
        const data = await User.findOne({ _id: userId, email: email });

        if (!data) {
            return {
                EM: 'User do not found!',
                EC: 1,
                DT: [],
            };
        }

        if (data.password) {
            return {
                EM: 'User have password!',
                EC: 1,
                DT: [],
            };
        }

        const hashedPass = await authApiService.hashUserPassword(password);

        await User.updateOne(
            { _id: userId, email: email },
            { password: hashedPass }
        );
        return {
            EM: 'Add password successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdatePassword = async (
    userId,
    email,
    newPassword,
    oldPassword
) => {
    try {
        let data = await User.findOne({ _id: userId, email: email });

        if (!data) {
            return {
                EM: 'User do not found!',
                EC: 1,
                DT: [],
            };
        }

        if (!data.password === '') {
            return {
                EM: 'User do not have password!',
                EC: 1,
                DT: [],
            };
        }

        const checkOldPassword = functionAuth.checkPassword(
            oldPassword,
            data.password
        );

        if (checkOldPassword === false) {
            return {
                EM: 'Your old password is invalid!',
                EC: 1,
                DT: [],
            };
        }

        const hashedPass = await authApiService.hashUserPassword(newPassword);
        await User.updateOne(
            { _id: userId, email: email },
            { password: hashedPass }
        );
        return {
            EM: 'Update password successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateAccountInfo = async (
    userId,
    email,
    fullname,
    address,
    sex,
    phone,
    birthDay
) => {
    try {
        const sexUpdate = '';
        if ((sex = 'female')) {
            sexUpdate = 'Nam';
        } else if ((sex = 'male')) {
            sexUpdate = 'Nữ';
        } else {
            sexUpdate = 'Khác';
        }
        let data = await User.updateOne(
            { _id: userId, email: email },
            {
                fullname: fullname,
                address: address,
                sex: sexUpdate,
                phone: phone,
                birthDay: birthDay,
            }
        );
        if (!data) {
            return {
                EM: 'User do not found!',
                EC: 1,
                DT: [],
            };
        }

        return {
            EM: 'Update account information successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleLogin,
    handleRegister,
    takeGroupInformation,
    handleCheckHavePassword,
    handleAddPassword,
    handleUpdatePassword,
    handleUpdateAccountInfo,
    handleConfirmOtpRegister,
};
