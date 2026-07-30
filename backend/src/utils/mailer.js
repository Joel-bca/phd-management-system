import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendCredentials = async (
  deliveryEmail,
  name,
  password,
  role,
  loginEmail,
) => {
  const mailOptions = {
    from: `"PhD Management System" <${process.env.EMAIL_USER}>`,
    to: deliveryEmail,
    subject: `Onboarding: Research Portal Access for ${name}`,
    html: `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, Helvetica, sans-serif;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px 0;">
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e5e7eb;">
                
                <!-- Header (Logo + Branding) -->
                <tr>
                  <td align="center" style="padding:20px;">
                    <img 
                      src="https://ci3.googleusercontent.com/meips/ADKq_NYjRerLJeCriHNZjl5k0FwTfSrglHmkyCa5LBfGhAVOejeJ39uKdMUN6POB5D_jO7MAwfytCd3E89C3nGfiQ7sJ=s0-d-e1-ft#https://christuniversity.in/images/logo.jpg" 
                      alt="Christ University" 
                      height="60" 
                      style="display:block;"
                    />
                  </td>
                </tr>

                <!-- Blue Title Bar -->
                <tr>
                  <td style="background-color:#1e3a8a; color:#ffffff; padding:12px 20px; font-size:18px; font-weight:bold;">
                    Research Portal Access
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:24px; color:#333;">
                    
                    <p style="font-size:14px; margin:0 0 10px 0;">
                      Dear <strong>${name}</strong>,
                    </p>

                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                      Your institutional account has been successfully provisioned. Please use the credentials below to access the Research Portal.
                    </p>

                    <!-- Credentials Box -->
                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color:#fafafa; border:1px solid #e5e7eb; margin-bottom:20px;">
                      <tr>
                        <td style="font-size:14px;">
                          <strong>Login Identifier:</strong><span style="color:#1e3a8a; font-weight:bold;">${loginEmail}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;">
                          <strong>Role:</strong> ${role}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;">
                          <strong>Password:</strong>
                          <span style="background:#e5e7eb; padding:4px 8px; display:inline-block;">
                            ${password}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Important Note -->
                    <p style="font-size:13px; color:#b91c1c; margin:0 0 20px 0;">
                      <strong>Important:</strong> Please log in using your <u>University Email Address</u> (${loginEmail}). 
                      The email where you received this message is for notification purposes only.
                    </p>

                    <!-- Divider -->
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">

                    <!-- Footer -->
                    <p style="font-size:12px; color:#6b7280; margin:0 0 10px 0;">
                      This is an automated administrative message. Please do not reply.
                    </p>

                    <p style="font-size:12px; color:#6b7280; margin:0 0 10px 0;">
                      After logging in, kindly confirm access with your supervisor. If you require assistance:
                    </p>

                    <p style="font-size:12px; margin:0;">
                      <a href="mailto:csbyc.connect@christuniversity.in?subject=Support%20Required%20on%20PhD%20System&body=Hi%20Support%20Team," 
                        style="color:#1e3a8a; text-decoration:none; font-weight:bold;">
                        Contact PhD System Support
                      </a>
                    </p>

                  </td>
                </tr>

                <!-- Footer Strip -->
                <tr>
                  <td style="background-color:#f9fafb; padding:10px 20px; font-size:11px; color:#6b7280; text-align:center;">
                    CHRIST (Deemed to be University), Bengaluru, India
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    return false;
  }
};

export const sendMeetingInvitation = async (
  emails,
  meetingData,
  supervisorName,
) => {
  const mailOptions = {
    from: `"PhD Management System" <${process.env.EMAIL_USER}>`,
    to: emails,
    subject: `Academic Session Established: ${meetingData.meeting_subject}`,
    html: `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e5e7eb;">
                <tr>
                  <td align="center" style="padding:20px;">
                    <img src="https://ci3.googleusercontent.com/meips/ADKq_NYjRerLJeCriHNZjl5k0FwTfSrglHmkyCa5LBfGhAVOejeJ39uKdMUN6POB5D_jO7MAwfytCd3E89C3nGfiQ7sJ=s0-d-e1-ft#https://christuniversity.in/images/logo.jpg" alt="Christ University" height="60" style="display:block;"/>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#1e3a8a; color:#ffffff; padding:12px 20px; font-size:18px; font-weight:bold;">
                    Academic Session Protocol
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px; color:#333;">
                    <p style="font-size:14px; margin:0 0 10px 0;">Dear Scholar,</p>
                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                      A new research advisory session has been established in the institutional registry. Please find the session parameters below.
                    </p>
                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color:#fafafa; border:1px solid #e5e7eb; margin-bottom:20px;">
                      <tr><td style="font-size:13px;"><strong>Subject:</strong> ${meetingData.meeting_subject}</td></tr>
                      <tr><td style="font-size:13px;"><strong Timestamp:</strong> ${new Date(meetingData.meeting_date).toLocaleString()}</td></tr>
                      <tr><td style="font-size:13px;"><strong>Mode:</strong> ${meetingData.meeting_mode.toUpperCase()}</td></tr>
                      <tr><td style="font-size:13px;"><strong>Location:</strong> ${meetingData.meeting_location}</td></tr>
                      ${meetingData.meeting_message ? `<tr><td style="font-size:13px; color:#1e3a8a;"><strong>Supervisor Note:</strong> ${meetingData.meeting_message}</td></tr>` : ""}
                    </table>
                    <p style="font-size:12px; color:#6b7280;">Established by: <strong>${supervisorName}</strong></p>
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
                    <p style="font-size:11px; color:#6b7280; text-align:center;">
                      This is an automated administrative notification from the PhD Management System. <br> Please confirm with your supervisor about the meeting.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Nodemailer Meeting Invitation Error:", error.message);
    return false;
  }
};
