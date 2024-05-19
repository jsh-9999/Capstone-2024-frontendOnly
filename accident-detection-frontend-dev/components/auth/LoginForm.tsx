'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; 
import { setCookie } from 'cookies-next';

type FormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>();

  const handleLoginSubmit = async (data: FormData) => {
    try {
      toast("Logging in...");
      const response = await fetch("http://localhost:8080/auth/users/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorMessage = response.headers.get('X-Error-Message') || 'Login failed. Please try again.';
        toast.error(errorMessage);
        return;
      }

      const getCookies = (): Record<string, string> => {
        return document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
          const [key, value] = cookie.split('=').map(part => decodeURIComponent(part.trim()));
          acc[key] = value;
          return acc;
        }, {});
      };
      
      const cookies = getCookies();
      const accessToken = cookies['Authorization'];
      const refreshToken = cookies['Refresh'];
      
      if (accessToken && refreshToken) {
        setCookie('Authorization', accessToken, {
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        setCookie('Refresh', refreshToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });
        toast.success("Logged in successfully!");
        router.push("/auth/bbb");
      } else {
        console.error('Token not received');
        toast.error("Authentication token was not received.");
      }
    } catch (error) {
      console.error("Error details:", error.message);
      toast.error(`An error occurred: ${error.message || "Please try again later."}`);
    }
  };

  return (
    <div className="sm:max-w-[460px] shadow-sm mx-auto bg-white p-5 border rounded-md">
      <h2 className="text-2xl font-bold pb-5 text-center underline">Login</h2>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username">
            UserId <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("username")}
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
            type="password"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("password")}
          />
          <span className="inline-block text-sm text-red-500">
            {errors.password && errors.password.message}
          </span>
        </div>
        <Button type="submit" className="w-full" size={"lg"}>
          Login
        </Button>
      </form>
    </div>
  );
}
