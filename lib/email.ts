import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactRequestEmail(
  donorEmail: string,
  donorName: string,
  requesterName: string,
  requesterEmail: string,
  bloodGroup: string,
  area: string,
  contactData?: {
    hospital?: string;
    address?: string;
    contact?: string;
    time?: string;
    message?: string;
  }
) {
  try {
    // Send email to the donor's registered email address
    const { data, error } = await resend.emails.send({
      from: 'Blood Bank <onboarding@resend.dev>',
      to: [requesterEmail], // Send to donor's registered email
      replyTo: requesterEmail, // Requester's email for replies
      subject: 'Urgent Blood Donation Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🩸 Urgent Blood Donation Request</h1>
          </div>
          
          <div style="padding: 30px; background-color: #fef2f2; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hello <strong>${donorName}</strong>,</p>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Someone urgently needs blood donation and would like to contact you. Please review the details below:
            </p>
            
            <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc2626;">
              <h2 style="color: #dc2626; margin-top: 0; font-size: 20px;">Request Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Requester Name:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    ${requesterName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Blood Group Needed:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                    <span style="background-color: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                      ${bloodGroup}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Location:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    ${area}
                  </td>
                </tr>
                ${
                  contactData?.hospital
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Hospital:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    ${contactData.hospital}
                  </td>
                </tr>
                `
                    : ''
                }
                ${
                  contactData?.address
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Hospital Address:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    ${contactData.address}
                  </td>
                </tr>
                `
                    : ''
                }
                ${
                  contactData?.contact
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Contact Number:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    <a href="tel:${contactData.contact}" style="color: #dc2626; text-decoration: none;">
                      ${contactData.contact}
                    </a>
                  </td>
                </tr>
                `
                    : ''
                }
                ${
                  contactData?.time
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #374151;">Required Time:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
                    ${new Date(contactData.time).toLocaleString()}
                  </td>
                </tr>
                `
                    : ''
                }
              </table>
              
              ${
                contactData?.message
                  ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
                <strong style="color: #374151; display: block; margin-bottom: 8px;">Additional Message:</strong>
                <p style="color: #6b7280; margin: 0; line-height: 1.6;">${contactData.message}</p>
              </div>
              `
                  : ''
              }
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Important:</strong> Please respond as soon as possible if you are available to donate. 
                Your quick response could save a life!
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 25px;">
              Thank you for being a lifesaver! ❤️
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">This is an automated message from the Blood Bank Management System.</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Resend email exception:', error);
    return { success: false, error };
  }
}
