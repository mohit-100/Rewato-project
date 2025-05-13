import { useEffect, useState } from 'react';

export default function PartnerAuth() {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']); // Store OTP in an array
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false); // Track phone number submission

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setIsPhoneSubmitted(true); // Mark phone as submitted
    alert(`Phone entered: ${phone}`);
    // You can replace this with your logic to send OTP to the phone number
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    alert(`OTP entered: ${otp.join('')}`);
    // Add OTP verification and submission logic
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 relative px-4">
      {/* App Logo Centered */}
      <h1 className="text-4xl font-bold text-amber-300 mb-6">🚕 Rewato</h1>

      {/* Phone Number Popup (Mobile Specific Animation) */}
      {showPopup && !isPhoneSubmitted && (
        <div
          className={`absolute w-full max-w-sm text-center transition-all duration-1000 ease-in-out
            ${showPopup ? 'transform translate-y-0' : 'transform translate-y-full'}
            sm:top-1/2 sm:translate-y-0 sm:transform-none
            md:top-1/2 md:transform-none md:translate-y-0`} // Animation only on mobile, centered on desktop
          style={{
            transform: showPopup ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.5s ease-in-out',
            bottom: '0', // Ensure it starts from the bottom on mobile
          }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-black">Earn on Every Ride</h1>
            <div>
              <h2 className="text-amber-300 font-bold text-5xl">Rewato</h2>
            </div>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Login with Phone Number</h2>
            <form onSubmit={handlePhoneSubmit}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4"
                placeholder="+91"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FFD700] text-white py-2 rounded hover:bg-[#FFD700]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Input Popup */}
      {showPopup && isPhoneSubmitted && (
        <div className="absolute bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
          <h1 className="text-black">Enter OTP</h1>
          <div>
            <h2 className="text-amber-300 font-bold text-5xl">Rewato</h2>
          </div>
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Enter the OTP sent to your phone</h2>
          <form onSubmit={handleOtpSubmit}>
            <div className="flex justify-between mb-4">
              {/* OTP inputs */}
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  className="w-12 h-12 text-center border border-gray-300 p-2 rounded"
                  placeholder="0"
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-white py-2 rounded hover:bg-[#FFD700]"
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
