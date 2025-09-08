import AuthService from '../service/authApiService.js';
import { verifyRefreshToken, createJWT } from '../middleware/jwtAction.js';

const maxAgee = 1000 * 60 * 60;

const googleLogin = async (req, res) => {
    try {
        const idToken = req.body.idToken;
        // console.log('check idToken: ', idToken);
        if (idToken) {
            const data = await AuthService.handleGoogleLogin(idToken);
            const { refresh_token, dataUser } = data.DT;
            // console.log('ssss', refresh_token);
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: maxAgee,
                sameSite: 'None',
                secure: true,
                path: '/',
                // domain: '.onrender.com',
            });
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: dataUser,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

const facebookLogin = async (req, res) => {
    try {
        const idToken = req.body.idToken;
        if (idToken) {
            const data = await AuthService.handleFacebookLogin(idToken);
            const { refresh_token, dataUser } = data.DT;
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: maxAgee,
                sameSite: 'None',
                secure: true,
                path: '/',
            });
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: dataUser,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

const getAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded === null) {
            return res.status(401).json({
                EM: 'The refresh token is expired!',
                EC: 692004,
                DT: [],
            });
        } else {
            const groupRoleData =
                await AuthService.takeRoleofGroupForNewAccessToken(decoded.id);
            const dataAccessToken = {
                id: decoded.id,
                email: decoded?.email,
                fullname: decoded?.fullname,
                groupWithRoles: groupRoleData,
            };
            // console.log(
            //     'check data of access token before create: ',
            //     dataAccessToken
            // );
            const newAcceseToken = await createJWT(dataAccessToken);

            // console.log('check new accesstoken: ', newAcceseToken);
            return res.status(200).json({
                EM: 'Get new access token successfully!',
                EC: 0,
                DT: newAcceseToken,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

const handleCheckAuth = async (req, res) => {
    try {
        return res.status(200).json({
            EM: 'Check authentication successfully, access token of user does not expired!',
            EC: 0,
            DT: [],
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            path: '/',
        });
        return res.status(200).json({
            EM: 'Logout successfully!',
            EC: 0,
            DT: [],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

const sendSupport = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await AuthService.handleSendSupport(formData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    googleLogin,
    facebookLogin,
    getAccessToken,
    handleCheckAuth,
    logout,
    sendSupport,
};
