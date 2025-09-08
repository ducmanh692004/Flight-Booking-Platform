import loginRegisterService from '../service/loginRegisterApiService.js';
import otpService from '../service/otpApiService.js';

const maxAgee = 1000 * 60 * 60;

const loginFunc = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email !== '' && password !== '') {
            const data = await loginRegisterService.handleLogin(
                email,
                password
            );

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
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const registerFunc = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body?.password || '';
        const fullname = req.body.fullname;
        const data = await loginRegisterService.handleRegister(
            email,
            password,
            fullname
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const confirmOtpRegisterFunc = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const data = await loginRegisterService.handleConfirmOtpRegister(
            email,
            otp
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const checkHavePasswordFunc = async (req, res) => {
    try {
        const userId = req.query.userId;
        const email = req.query.email;
        const data = await loginRegisterService.handleCheckHavePassword(
            userId,
            email
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const addPasswordFunc = async (req, res) => {
    try {
        const userId = req.body.userId;
        const email = req.body.email;
        const password = req.body.password;
        const data = await loginRegisterService.handleAddPassword(
            userId,
            email,
            password
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const updatePasswordFunc = async (req, res) => {
    try {
        const userId = req.body.userId;
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const data = await loginRegisterService.handleUpdatePassword(
            userId,
            email,
            newPassword,
            oldPassword
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const updateAccountInfo = async (req, res) => {
    try {
        const userId = req.body.userId;
        const email = req.body.email;
        const fullname = req.body.fullname;
        const address = req.body.address;
        const sex = req.body.sex;
        const phone = req.body.phone;
        const birthDay = req.body.birthDay;

        const data = await loginRegisterService.handleUpdateAccountInfo(
            userId,
            email,
            fullname,
            address,
            sex,
            phone,
            birthDay
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const sendEmailTakePasswordFunc = async (req, res) => {
    try {
        const email = req.body.email;
        const data = await otpService.handleSendEmailTakePassword(email);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        };
    }
};

const confirmOtpForgetPasswordFunc = async (req, res) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const data = await otpService.handleConfirmOtpForgetPassword(
            otp,
            email
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const insertNewPasswordFunc = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const data = await otpService.handleInsertNewPassword(email, password);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    loginFunc,
    registerFunc,
    checkHavePasswordFunc,
    addPasswordFunc,
    updatePasswordFunc,
    updateAccountInfo,
    sendEmailTakePasswordFunc,
    confirmOtpForgetPasswordFunc,
    insertNewPasswordFunc,
    confirmOtpRegisterFunc,
};
