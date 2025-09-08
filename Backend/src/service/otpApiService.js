import user from '../models/user.js';
import redisClient from '../config/redis.js';
// import {
//     sendOtpForgetPassword,
//     sendOtpRegisterAccount,
// } from '../service/emailService.js';
import emailService from '../service/emailService.js';
import authApiService from './authApiService.js';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const handleSendEmailTakePassword = async (email) => {
    try {
        const dataUser = await user.findOne({ email: email });
        if (dataUser === null) {
            return {
                EM: 'Email account does not register before!',
                EC: 1,
                DT: [],
            };
        }

        const otp = generateOTP();
        const key = `forget-password:${email}`;
        const value = JSON.stringify({
            otp,
            userId: dataUser._id.toString(),
            email,
        });

        await redisClient.set(key, value, 'EX', 120);

        await emailService.sendOtpForgetPassword(dataUser.email, otp);

        return {
            EM: 'OTP has been sent successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong on server!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleConfirmOtpForgetPassword = async (otp, email) => {
    try {
        const key = `forget-password:${email}`;
        const data = await redisClient.get(key);

        // console.log('check data redisssss: ', data);
        if (!data) {
            return {
                EM: 'OTP expired or not found. Please request a new one!',
                EC: 1,
                DT: [],
            };
        }

        const parsed = JSON.parse(data);
        // console.log('check data redis: ', parsed);
        // console.log('check user otp: ', otp);

        if (parsed.otp !== otp) {
            return {
                EM: 'OTP is incorrect!',
                EC: 1,
                DT: [],
            };
        }

        await redisClient.del(key);

        const allowKey = `reset-password-allow:${email}`;
        await redisClient.set(allowKey, 'true', 'EX', 120);

        return {
            EM: 'OTP confirmed. You can now reset your password!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong on server!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleInsertNewPassword = async (email, password) => {
    try {
        const key = `reset-password-allow:${email}`;
        const data = await redisClient.get(key);
        if (!data) {
            return {
                EM: 'Reset password process expired. Please send new otp!',
                EC: 1,
                DT: [],
            };
        }

        const allowKey = `reset-password-allow:${email}`;
        await redisClient.del(allowKey);

        const dataUser = await user.findOne({ email: email });
        if (dataUser === null) {
            return {
                EM: 'Email account does not register before!',
                EC: 1,
                DT: [],
            };
        }

        const hashedPass = authApiService.hashUserPassword(password);

        await user.updateOne({ _id: dataUser._id }, { password: hashedPass });

        return {
            EM: 'Reset password successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong on server!',
            EC: '-1',
            DT: [],
        };
    }
};

const createOtpRegister = async (email, password, fullName) => {
    try {
        const otp = generateOTP();
        const key = `register-otp:${email}`;
        const value = JSON.stringify({
            otp,
            email,
            password,
            fullName,
        });

        await redisClient.set(key, value, 'EX', 120);

        await emailService.sendOtpRegisterAccount(email, otp);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const hadnleConfirmOtpRegister = async (otp, email) => {
    try {
        // console.log('check email reigstte:', email);
        const key = `register-otp:${email}`;
        const data = await redisClient.get(key);

        // console.log('check data redisssss: ', data);

        if (!data) {
            return {
                EM: 'OTP expired or not found. Please register again!',
                EC: 1,
                DT: [],
            };
        }

        const parsed = JSON.parse(data);
        if (parsed.otp !== otp) {
            return {
                EM: 'OTP is incorrect!',
                EC: 1,
                DT: [],
            };
        }

        const dataRegister = {
            email: parsed.email,
            password: parsed.password,
            fullname: parsed.fullName,
        };

        await redisClient.del(key);

        return {
            EM: 'OTP ok',
            EC: 0,
            DT: dataRegister,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in confirm otp process!',
            EC: '-1',
            DT: [],
        };
    }
};

export default {
    handleSendEmailTakePassword,
    handleConfirmOtpForgetPassword,
    handleInsertNewPassword,
    createOtpRegister,
    hadnleConfirmOtpRegister,
};
