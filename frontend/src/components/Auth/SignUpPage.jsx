import { useNavigate } from "react-router-dom";
import { useState  } from "react";
import {Link} from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuthStore } from "../../store/Authstore.jsx";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    password: "",
    role: "",
    companyName: "",
    companyEmail: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const { isSigningUp  , signUp , user } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      client_name : formData.companyName,
      client_email : formData.companyEmail
    }
    
    // Simulate API call
    const response = await signUp(payload);


    if(response.success){

      navigate("/verify-email/" + user.email);
    } else {
      alert(response.message);
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-[#121214] border border-white/10 shadow-2xl rounded-3xl w-full p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Fill in your details to get started
            </p>
          </div>

          {/* Sign Up Form - Single Column */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Personal Information Section */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Personal Information
              </h2>
              
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full pr-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                >
                  <option value="" disabled>Select your role</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  
                </select>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-5 pt-2">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Company Information
                
              </h2>
              
              {/* Company Name */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="Acme Inc."
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20"
                />
                <span className="ml-2 text-sm text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#8B2FC9] hover:text-white transition-colors font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#8B2FC9] hover:text-white transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20"
                />
                <span className="ml-2 text-sm text-gray-400">
                  Subscribe to newsletter for updates
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-4"
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
}