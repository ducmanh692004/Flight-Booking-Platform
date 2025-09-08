import user from '../models/user.js';
// import group from '../models/group';
import cart from '../models/cart.js';
import admin from '../config/firebaseAdmin.js';
import role from '../models/role.js';
import group from '../models/group.js';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
import { createJWT, createRefreshJWT } from '../middleware/jwtAction.js';
// import { add, take } from 'lodash';
import support from '../models/support.js';

const verifyFirebaseIdToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        const name = decodedToken.name;
        const image = decodedToken.picture;

        return { uid, email, name, decodedToken, image };
    } catch (error) {
        console.error(error);
    }
};

const takeGroupInformation = async (groupId) => {
    try {
        let dataGroup = await group.findById(groupId).populate({
            path: 'listRoles',
            model: 'Role',
            select: 'url',
        });
        // console.log('kkkkkkg', dataGroup);

        return dataGroup.listRoles;
    } catch (error) {
        console.log('check error: ', error);
    }
};

const insertProviderandProviderId = async (userId, provider, providerId) => {
    try {
        await user.findByIdAndUpdate(userId, {
            provider: provider,
            providerId: providerId,
        });
    } catch (error) {
        console.log(error);
    }
};

const handleGoogleLogin = async (idToken) => {
    try {
        const tokenVerify = await verifyFirebaseIdToken(idToken);
        const userInformation = await checkEmailFound(tokenVerify.email);
        // console.log('check data of token verify: ', tokenVerify);
        if (userInformation) {
            const dataGroup = await takeGroupInformation(
                userInformation.groupId
            );

            // console.log('checkkkkkk: ', dataGroup);
            let payload = {
                id: userInformation._id,
                email: userInformation.email,
                fullname: userInformation.fullname,
                groupWithRoles: dataGroup,
            };

            insertProviderandProviderId(
                userInformation._id,
                'google',
                tokenVerify.uid
            );
            const token = await createJWT(payload);
            const refresh_token = await createRefreshJWT({
                id: userInformation._id,
                email: userInformation.email,
                fullname: userInformation.fullname,
            });
            // console.log('check refresh_tokennnn:', refresh_token);
            // console.log('check token: ', token);
            return {
                EM: 'Login successfully!',
                EC: 0,
                DT: {
                    refresh_token: refresh_token,
                    dataUser: {
                        access_token: token,
                        id: userInformation._id,
                        email: userInformation.email,
                        fullname: userInformation.fullname,
                        phone: userInformation?.phone || '',
                        sex: userInformation?.sex || '',
                        address: userInformation?.address || '',
                        image: userInformation?.image || '',
                        birthDay: userInformation?.birthDay || '',
                        group: userInformation.groupId.name,
                    },
                },
            };
        } else {
            let dataGroup = await group.findOne({ name: 'client' });
            // console.log('check data group response: ', dataGroup);
            let dataCreate = await user.create({
                uid: tokenVerify.uid,
                email: tokenVerify.email,
                fullname: tokenVerify.name,
                image: tokenVerify?.image || '',
                groupId: dataGroup._id,
                provider: 'google',
                providerId: tokenVerify.uid,
            });
            await cart.create({ user_id: dataCreate._id });

            // console.log('check data user created: ', dataCreate);
            // let dataUser = await checkEmailFound(tokenVerify.email);
            const dataGroupRole = await takeGroupInformation(
                dataCreate.groupId
            );
            const payload = {
                id: dataCreate._id,
                email: dataCreate.email,
                fullname: dataCreate.fullname,
                password: dataCreate?.password || '',
                groupWithRoles: dataGroupRole,
            };

            const token = await createJWT(payload);
            const refresh_token = await createRefreshJWT({
                id: dataCreate._id,
                email: dataCreate.email,
                fullname: dataCreate.fullname,
            });
            return {
                EM: 'Login successfully!',
                EC: 0,
                DT: {
                    refresh_token: refresh_token,
                    dataUser: {
                        access_token: token,
                        id: dataCreate._id,
                        email: dataCreate.email,
                        fullname: dataCreate.fullname,
                        phone: dataCreate?.phone || '',
                        sex: dataCreate?.sex || '',
                        address: dataCreate?.address || '',
                        image: dataCreate?.image || '',
                        birthDay: dataCreate?.birthDay || '',
                        group: dataGroup.name,
                        groupWithRoles: dataGroupRole,
                    },
                },
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

const checkAccountFoundWithProvider = async (provider, providerId) => {
    try {
        const userData = await user.findOne({
            provider: provider,
            providerId: providerId,
        });
        // console.log('check user data:', userData);
        if (userData) {
            return userData;
        }
    } catch (error) {
        console.log(error);
    }
};

const handleFacebookLogin = async (idToken) => {
    try {
        const tokenVerify = await verifyFirebaseIdToken(idToken);
        const userInformation = await checkAccountFoundWithProvider(
            'facebook',
            tokenVerify.uid
        );

        if (userInformation) {
            const groupData = await group.findOne({
                _id: userInformation.groupId,
            });

            const dataGroup = await takeGroupInformation(
                userInformation.groupId
            );

            let payload = {
                id: userInformation._id,
                email: userInformation?.email || '',
                fullname: userInformation.fullname,
                password: userInformation?.password || '',
                groupWithRoles: dataGroup,
            };
            const token = await createJWT(payload);
            const refresh_token = await createRefreshJWT({
                id: userInformation._id,
                email: userInformation.email,
                fullname: userInformation.fullname,
            });
            return {
                EM: 'Login successfully!',
                EC: 0,
                DT: {
                    refresh_token: refresh_token,
                    dataUser: {
                        access_token: token,
                        id: userInformation._id,
                        email: userInformation?.email || '',
                        fullname: userInformation.fullname,
                        phone: userInformation?.phone || '',
                        sex: userInformation?.sex || '',
                        address: userInformation?.address || '',
                        image: userInformation?.image || '',
                        birthDay: userInformation?.birthDay || '',
                        group: groupData.name,
                    },
                },
            };
        } else {
            let dataClient = await group.findOne({ name: 'client' });
            let dataCreate = await user.create({
                providerId: tokenVerify.uid,
                provider: 'facebook',
                email: tokenVerify?.email || '',
                fullname: tokenVerify.name,
                image: tokenVerify?.image || '',
                groupId: dataClient._id,
            });

            await cart.create({ user_id: dataCreate._id });

            const dataGroup = await takeGroupInformation(dataClient._id);
            const payload = {
                id: dataCreate._id,
                email: dataCreate?.email || '',
                fullname: dataCreate.fullname,
                password: dataCreate?.password || '',
                groupWithRoles: dataGroup,
            };

            const token = await createJWT(payload);
            const refresh_token = await createRefreshJWT({
                id: dataCreate._id,
                email: dataCreate.email,
                fullname: dataCreate.fullname,
            });
            return {
                EM: 'Login successfully!',
                EC: 0,
                DT: {
                    refresh_token: refresh_token,
                    dataUser: {
                        access_token: token,
                        id: dataCreate._id,
                        email: dataCreate?.email || '',
                        fullname: dataCreate.fullname,
                        phone: dataCreate?.phone || '',
                        sex: dataCreate?.sex || '',
                        address: dataCreate?.address || '',
                        image: dataCreate?.image || '',
                        birthDay: dataCreate?.birthDay || '',
                        group: dataClient.name,
                    },
                },
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

const checkEmailFound = async (emailFind) => {
    try {
        const userData = await user
            .findOne({ email: emailFind })
            .populate('groupId');
        if (userData) {
            return userData;
        }
    } catch (error) {
        console.log(error);
    }
};

const hashUserPassword = (userpassword) => {
    let hashPassword = bcrypt.hashSync(userpassword, salt);
    return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const takeRoleofGroupForNewAccessToken = async (userId) => {
    try {
        const data = await user.findById(userId).populate('groupId');
        const dataGroup = await takeGroupInformation(data.groupId);
        return dataGroup;
    } catch (error) {
        console.log(error);
    }
};

const handleSendSupport = async (formData) => {
    try {
        const userId = formData.userId;
        const email = formData.email;
        const content = formData.content;
        // console.log('checiii:', userId, email, content);
        await support.create({
            userId: userId || null,
            content: content,
            emailContact: email,
        });
        return {
            EM: 'Send support successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleFacebookLogin,
    handleGoogleLogin,
    checkEmailFound,
    hashUserPassword,
    checkPassword,
    takeRoleofGroupForNewAccessToken,
    handleSendSupport,
};
