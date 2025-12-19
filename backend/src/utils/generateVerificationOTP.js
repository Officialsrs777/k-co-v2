export const generateVerificationOTP = () => {
  const otp = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  return { otp, expires };
}