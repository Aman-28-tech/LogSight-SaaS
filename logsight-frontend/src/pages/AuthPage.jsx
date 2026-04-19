import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import AuthForm from "../components/AuthForm";
import { loginUser, registerUser, socialLoginUser } from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "../config/firebase";

export default function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      return setErrorMsg("Please fill all fields");
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = isLogin
        ? await loginUser({ email, password })
        : await registerUser({ email, password });

      if (isLogin) {
        const nextToken = res.data?.data?.token;

        if (!res.data?.success || !nextToken) {
          throw new Error("Invalid login response");
        }

        localStorage.setItem("token", nextToken);
        setToken(nextToken);
      } else {
        const nextToken = res.data?.data?.token || res.data?.token;

        if (!res.data?.success || !nextToken) {
          throw new Error("Invalid register response");
        }

        localStorage.setItem("token", nextToken);
        setToken(nextToken);
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const fallbackMessage = isLogin ? "Login failed ❌" : "Auth failed ❌";
      setErrorMsg(apiMessage || err.message || fallbackMessage);
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
          title={isLogin ? "Welcome back" : "Create your account"}
          subtitle="Sign in to inspect live logs, track service health, and review incoming events from one place."
        />

      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
        handleGithubAuth={handleGithubAuth}
        loading={loading}
        errorMsg={errorMsg}
      />
      </div>
    </div>
  );
}
