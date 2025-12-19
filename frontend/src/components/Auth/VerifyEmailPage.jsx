

import { useState  } from "react";
import AuthLayout from "./AuthLayout.jsx";
import { useAuthStore } from "../../store/Authstore.jsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
    const navigate = useNavigate();


  const handleChange = (e) => {
    const value = e.target.value;

    
      setOtp(value);
    
  };

  const {isVerifying, verifyEmail } = useAuthStore();
        const {email} = useParams();

    const verifyEmailHandler = async () => {
        const response = await verifyEmail({ email,  otp });
        if (response.success) {
            navigate("/sign-in");
        } else {
            alert(response.message || "Verification failed");
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#121214] border border-white/10 shadow-2xl rounded-3xl w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the OTP
            </p>
          </div>

          <form>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleChange}

                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-3 px-4 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full text-center text-xl tracking-widest"
                  placeholder="Enter OTP"
                />
                
              </div>

              <button
                type="button"
                disabled={isVerifying}
                onClick={verifyEmailHandler}
                className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full transition-all duration-200"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}