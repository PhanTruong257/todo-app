const nodemailer = require('nodemailer');

// Cấu hình transporter
// Lưu ý: Trong môi trường production, nên lưu thông tin này trong biến môi trường
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc nhà cung cấp email khác
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password' // Sử dụng app password nếu bạn bật xác thực 2 yếu tố
    },
 
});

/**
 * Gửi email khôi phục mật khẩu
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} resetToken - Token để khôi phục mật khẩu
 * @param {string} name - Tên người dùng
 * @returns {Promise} - Promise của việc gửi email
 */
const sendPasswordResetEmail = async (to, resetToken, name) => {
    // Tạo liên kết đặt lại mật khẩu
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log('Reset link created:', resetLink);

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to,
        subject: 'Khôi phục mật khẩu',
        // Thêm phiên bản văn bản thuần
        text: `Xin chào ${name || 'bạn'},\n\nChúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.\n\nVui lòng truy cập liên kết sau để đặt lại mật khẩu: ${resetLink}\n\nLiên kết này sẽ hết hạn sau 15 phút.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nTrân trọng,\nTodo App Team`,
        // Phiên bản HTML
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Khôi phục mật khẩu</h2>
        <p>Xin chào ${name || 'bạn'},</p>
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Đặt lại mật khẩu
          </a>
        </p>
        <p>Hoặc sao chép và dán liên kết này vào trình duyệt của bạn: <br><a href="${resetLink}">${resetLink}</a></p>
        <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Todo App Team</p>
      </div>
    `
    }; try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Không thể gửi email: ${error.message}`);
    }
};

module.exports = {
    sendPasswordResetEmail
};
