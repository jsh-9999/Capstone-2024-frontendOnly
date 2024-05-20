'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

type FormData = {
  username: string;
  email: string;
  password: string;
  code?: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleSignUpSubmit = async (data: FormData) => {
    try {
      // 서버로 회원가입 요청을 보냄
      const response = await fetch("https://backend-capstone.site/auth/users/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
        }),
      });

      const responseData = await response.json();

      // 회원가입 성공 메시지 출력
      toast.success(responseData.msg);

      // 회원가입 폼 초기화
      reset();

      // 로그인 페이지로 이동
      window.location.href = "/auth/login"; // 페이지 이동
    } catch (error: any) {
      // 회원가입 실패 메시지 출력
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleCodeSubmit = async (data: FormData) => {
    try {
      // 서버로 인증번호 요청을 보냄
      const response = await fetch("https://backend-capstone.site/auth/users/sign-up/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: data.email,
        }),
      });

      // 응답 코드 확인
      if (response.ok) {
        toast.success("Verification code sent successfully.");
      } else {
        toast.error("Failed to send verification code.");
      }
    } catch (error: any) {
      // 오류 메시지 출력
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="sm:max-w-[460px] shadow-sm mx-auto bg-white p-5 border rounded-md">
      <h2 className="text-2xl font-bold pb-5 text-center underline">Sign Up</h2>
      <form className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username">
            UserId <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("username", {
              required: "UserId is required",
              pattern: {
                value: /^[a-zA-Z0-9]*$/,
                message: "UserId must contain only letters and numbers",
              },
            })}
          />
          <span className="inline-block text-sm text-red-500">
            {errors.username && errors.username.message}
          </span>
        </div>
        <div className="space-y-2">
          <label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"  // 이 부분을 'text'에서 'password'로 변경
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
                message: "Password must contain at least one number",
              },
            })}
          />
          <span className="inline-block text-sm text-red-500">
            {errors.password && errors.password.message}
          </span>
        </div>
        <div className="space-y-2">
          <label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("email", { required: "Email is required" })}
          />
          <span className="inline-block text-sm text-red-500">
            {errors.email && errors.email.message}
          </span>
        </div>
        <div className="space-y-2">
          <label htmlFor="code">
            <span className="text-red-500"></span>
            <Button className="w-full" size={"lg"} onClick={handleSubmit(handleCodeSubmit)}>인증번호 보내기</Button>
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("code")}
          />
          <span className="inline-block text-sm text-red-500">
            {errors.code && errors.code.message}
          </span>
        </div>
        <Button className="w-full" size={"lg"} onClick={handleSubmit(handleSignUpSubmit)}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
