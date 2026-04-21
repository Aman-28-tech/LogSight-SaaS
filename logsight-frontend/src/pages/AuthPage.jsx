import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import AuthForm from "../components/AuthForm";
import OTPForm from "../components/OTPForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { loginUser, registerUser, socialLoginUser, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "../config/firebase";

export default function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleAuth = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) {
      return setErrorMsg("Please fill all fields");
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = isLogin
        ? await loginUser({ email, password })
        : await registerUser({ email, password });

      if (isLogin) {
        const nextToken = res.data?.data?.token || res.data?.token;

        if (!res.data?.success || !nextToken) {
          throw new Error("Invalid login response");
        }

        localStorage.setItem("token", nextToken);
        setToken(nextToken);
      } else {
        // Registration success, but need verification
        if (res.data?.success) {
          setIsVerifying(true);
          setSuccessMsg("Account created! Please check your email for the code.");
        } else {
          throw new Error("Invalid register response");
        }
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      
      // If user is not verified during login, switch to verification mode
      if (err.response?.status === 403 && apiMessage?.toLowerCase().includes("verify")) {
        setIsVerifying(true);
        setErrorMsg("");
        return;
      }

      const fallbackMessage = isLogin ? "Login failed ❌" : "Auth failed ❌";
      setErrorMsg(apiMessage || err.message || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await verifyOTP({ email, otp });
      const token = res.data?.data?.token || res.data?.token;

      if (res.data?.success && token) {
        localStorage.setItem("token", token);
        setToken(token);
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      await resendOTP({ email });
      setSuccessMsg("A new verification code has been sent!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to resend OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await forgotPassword({ email });
      if (res.data?.success) {
        setIsForgotMode(false);
        setIsResetMode(true);
        setSuccessMsg("We sent a reset code to your email if an account exists.");
      } else {
        throw new Error("Failed to send reset code.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send reset code ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (otp, newPassword) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await resetPassword({ email, otp, newPassword });
      if (res.data?.success) {
        setIsResetMode(false);
        setIsLogin(true); // Back to login screen
        setSuccessMsg("Password reset successfully! You can now log in.");
        setPassword(""); // Clear the password field
      } else {
        throw new Error("Failed to reset password.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      // Map Github user securely via backend
      const genEmail = user.email || `${user.uid}@github.logsight.local`;

      try {
        const res = await socialLoginUser({ email: genEmail, uid: user.uid });
        const token = res.data?.data?.token || res.data?.token;

        if (token) {
           localStorage.setItem("token", token);
           setToken(token);
           return;
        }
        throw new Error("Backend social login returned invalid response");
      } catch (e) {
        throw new Error(e.response?.data?.message || "Backend social login failed.");
      }
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        const apiMessage = error.response?.data?.message;
        setErrorMsg(apiMessage || error.message || "Github Authentication Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Animated Subtle Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="relative z-10">
        <Header
          showActions={false}
          eyebrow="Access"
          title={isForgotMode ? "Reset Password" : isResetMode ? "Set New Password" : isLogin ? "Welcome back" : "Create your account"}
          subtitle={isForgotMode || isResetMode ? "Enter the details to recover your account securely." : "Sign in to inspect live logs, track service health, and review incoming events from one place."}
        />

      {isForgotMode ? (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          handleForgotPassword={handleForgotPassword}
          onBackToLogin={() => {
            setIsForgotMode(false);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      ) : isResetMode ? (
        <ResetPasswordForm
          email={email}
          handleResetPassword={handleResetPassword}
          onBackToLogin={() => {
            setIsResetMode(false);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          onResend={handleForgotPassword}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      ) : isVerifying ? (
        <OTPForm
          email={email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      ) : (
        <AuthForm
          isLogin={isLogin}
          setIsLogin={(val) => {
            setIsLogin(val);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuth={handleAuth}
          handleGithubAuth={handleGithubAuth}
          loading={loading}
          errorMsg={errorMsg}
          onForgotPassword={() => {
            setIsForgotMode(true);
            setErrorMsg("");
            setSuccessMsg("");
          }}
        />
      )}
      </div>
    </div>
  );
}
