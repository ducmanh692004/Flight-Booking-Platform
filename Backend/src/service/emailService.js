import nodemailer from 'nodemailer';

const sendEmail = (to, subject, orderId, name, paymentMethod, language) => {
    const orderDate = new Date().toLocaleDateString('vi-VN'); // ✅ ngày hiện tại

    const htmlContent1 = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #4CAF50;">🎉 Xin chào ${name}!</h2>
      <p>Đơn hàng của bạn đã được đặt thành công.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td><strong>Mã đơn hàng:</strong></td>
          <td>#${orderId}</td>
        </tr>
        <tr>
          <td><strong>Ngày đặt:</strong></td>
          <td>${orderDate}</td>
        </tr>
        <tr>
          <td><strong>Hình thức thanh toán:</strong></td>
          <td>${paymentMethod}</td>
        </tr>
      </table>

      <p>Vui lòng chú ý lịch bay để không bỏ lỡ chuyến bay của bạn. Nếu có bất kì thắc mắc gì hãy liên hệ ngay với chúng tôi.</p>
      <p>Xin trân trọng cảm ơn quý khách đã sử dụng dịch vụ.</p>
    </div>
  `;

    const htmlContent2 = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">🎉 Dear ${name},</h2>
        <p>Your order has been successfully placed.</p>
        <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td><strong>Order ID:</strong></td>
            <td>#${orderId}</td>
        </tr>
        <tr>
            <td><strong>Order Date:</strong></td>
            <td>${orderDate}</td>
        </tr>
        <tr>
            <td><strong>Payment Method:</strong></td>
            <td>${paymentMethod}</td>
        </tr>
        </table>

        <p>Please pay close attention to your flight schedule to avoid missing your departure. Should you have any questions or concerns, do not hesitate to contact us directly.</p>
        <p>We sincerely appreciate your trust in our services.</p>
    </div>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manhanh0609@gmail.com',
            pass: 'tfvy silm sfjo yngd',
        },
    });

    return transporter.sendMail({
        from: 'manhanh0609@gmail.com',
        to,
        subject,
        html: language === 'vi' ? htmlContent1 : htmlContent2,
    });
};

const sendOtpForgetPassword = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manhanh0609@gmail.com',
            pass: 'tfvy silm sfjo yngd',
        },
    });

    const mailOptions = {
        from: 'manhanh0609@gmail.com',
        to: to,
        subject: 'Mã OTP khôi phục mật khẩu',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #4CAF50;">🔐 Yêu cầu khôi phục mật khẩu</h2>
            <p>Vui lòng sử dụng mã OTP bên dưới để xác minh:</p>
            <h3 style="color: #d32f2f;">${otp}</h3>
            <p><strong>Lưu ý:</strong> Mã OTP chỉ có hiệu lực trong vòng <strong>2 phút</strong>.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Không thể gửi OTP, vui lòng thử lại sau.');
    }
};

const sendOtpRegisterAccount = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manhanh0609@gmail.com',
            pass: 'tfvy silm sfjo yngd',
        },
    });

    const mailOptions = {
        from: 'manhanh0609@gmail.com',
        to: to,
        subject: 'Mã OTP đăng kí tài khoản',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #4CAF50;">🔐 Yêu cầu đăng kí tài khoản</h2>
            <h5>Nếu không phải bạn vui lòng bỏ qua xác nhận này.</h5>
            <p>Vui lòng sử dụng mã OTP bên dưới để xác minh:</p>
            <h3 style="color: #d32f2f;">${otp}</h3>
            <p><strong>Lưu ý:</strong> Mã OTP chỉ có hiệu lực trong vòng <strong>2 phút</strong>.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Không thể gửi OTP, vui lòng thử lại sau.');
    }
};

const sendConfirmRefundMoney = async (to, orderId, totalMoney) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manhanh0609@gmail.com',
            pass: 'tfvy silm sfjo yngd',
        },
    });

    const mailOptions = {
        from: 'manhanh0609@gmail.com',
        to: to,
        subject: 'Yêu cầu hoàn tiền được xử lý thành công',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #4CAF50;">Đơn hàng: ${orderId} của bạn đã được hoàn tiền thành công!</h2>

            <h3 style="color: #d32f2f;">Số tiền hoàn: ${totalMoney}</h3>
            <p><strong>Lưu ý:</strong> nếu có bất kì yêu cầu nào vui lòng gửi yêu cầu hỗ trợ ngay cho chúng tôi!<strong></strong>.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Không thể gửi OTP, vui lòng thử lai sau');
    }
};

const sendConfirmRejectRefundMoney = async (to, orderId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manhanh0609@gmail.com',
            pass: 'tfvy silm sfjo yngd',
        },
    });

    const mailOptions = {
        from: 'manhanh0609@gmail.com',
        to: to,
        subject: 'Yêu cầu hoàn tiền không thành công',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
           <h2 style="color: #4CAF50;">Id đơn hàng: ${orderId} của bạn bị từ chối hoàn tiền bởi quản trị viên!</h2>

            <p><strong>Lưu ý:</strong> nếu có bất kì yêu cầu nào vui lòng gửi yêu cầu hỗ trợ ngay cho chúng tôi!<strong></strong>.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Không thể gửi OTP, vui lòng thử lai sau');
    }
};

export default {
    sendEmail,
    sendOtpForgetPassword,
    sendOtpRegisterAccount,
    sendConfirmRefundMoney,
    sendConfirmRejectRefundMoney,
};
