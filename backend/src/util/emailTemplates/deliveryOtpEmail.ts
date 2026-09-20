interface DeliveryOtpEmail {
  subject: string;
  text: string;
  html: string;
}

const getDeliveryOtpEmail = (deliveryOtp: string): DeliveryOtpEmail => {
  return {
    subject: "Your delivery OTP",

    text: `Your delivery OTP is ${deliveryOtp}. Please share it with the delivery partner to confirm delivery.`,

    html: `
      <p>Your delivery OTP is <strong>${deliveryOtp}</strong>.</p>
      <p>Please share it with the delivery partner to confirm delivery.</p>
    `,
  };
};

export default getDeliveryOtpEmail;