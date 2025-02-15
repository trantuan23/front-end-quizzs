"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { forgotPassword, verifyOtp, resetPassword } from "@/app/actions/auth.action";
import { useRouter } from "next/navigation";
import { CheckCircle, KeyRound, Lock, Mail } from "lucide-react";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Nhập mật khẩu mới
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const steps = [
    { id: 1, label: "Nhập Email" },
    { id: 2, label: "Nhập OTP" },
    { id: 3, label: "Đặt Mật khẩu" },
  ];

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      toast({ title: "Mã OTP đã được gửi", description: "Vui lòng kiểm tra email." });
      setStep(2);
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOtp = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    } else if (value === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const formattedOtp = otpValues.join("");
  
    try {
      setLoading(true);
      const response = await verifyOtp(email, formattedOtp);
  
      if (response.message === "Mã OTP hợp lệ.") {
        toast({ title: "OTP hợp lệ!", description: "Đang chuyển bước..." });
        setStep(3);
      } else {
        throw new Error(response.message || "OTP không hợp lệ");
      }
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
      setOtpValues(Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };
  


  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Lỗi", description: "Mật khẩu không khớp.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, otpValues.join(""), newPassword);
      toast({ title: "Cập nhật mật khẩu thành công", description: "Vui lòng đăng nhập lại." });
      setStep(1);
      setEmail("");
      setOtpValues(Array(6).fill(""));
      setNewPassword("");
      setConfirmPassword("");
      router.push("/home/auth/authForm")
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ step }: { step: number }) => {
    const steps = [
      { id: 1, label: "Nhập Email", icon: <Mail className="w-5 h-5" /> },
      { id: 2, label: "Nhập OTP", icon: <KeyRound className="w-5 h-5" /> },
      { id: 3, label: "Đặt Mật khẩu", icon: <Lock className="w-5 h-5" /> },
    ];
  
    return (
      <div className="flex justify-center space-x-6 mb-6">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                step > s.id ? "bg-green-500" : step === s.id ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              {step > s.id ? <CheckCircle className="w-5 h-5 text-white" /> : s.icon}
            </div>
            <span className={`${step >= s.id ? "text-black font-semibold" : "text-gray-500"}`}>{s.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex pt-20 justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white">
      <StepIndicator step={step} />
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          {step === 1 ? "Quên mật khẩu" : step === 2 ? "Nhập OTP" : "Đặt mật khẩu mới"}
        </h2>

        {step === 1 && (
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button className="w-full mt-4" onClick={handleForgotPassword} disabled={loading}>
              {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
            </Button>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="mb-4 flex justify-center space-x-2">
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={val}
                  maxLength={1}
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                />
              ))}
            </div>
            <Button className="w-full mt-4" onClick={handleVerifyOtp} disabled={otpValues.includes("") || loading}>
              {loading ? "Đang xác minh..." : "Xác minh OTP"}
            </Button>
          </>
        )}

        {step === 3 && (
          <div className="mb-4">
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full mt-4" onClick={handleResetPassword} disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
