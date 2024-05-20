"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, removeCookies } from 'cookies-next';
import Hero from "@/components/mainboard/Hero";
import Features from "@/components/mainboard/Features";
import ModelTest from "@/components/mainboard/ModelTest";

interface Notification {
  message: string;
  // 필요한 다른 속성들을 여기에 추가할 수 있습니다.
}

export default function Home() {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const token = getCookie("Authorization");
    const refreshToken = getCookie("Refresh");
    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);

    if (!token || !refreshToken) {
      console.log("No token found, redirecting to login page.");
      router.push('/auth/login');
    } else {
      // 쿠키에 토큰 저장
      saveTokenToCookie(token as string);
      saveRefreshTokenToCookie(refreshToken as string);
      // SSE 연결 설정하여 알림 수신
      setupSSEConnection();
    }
  }, [router]);

  const saveTokenToCookie = (token: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7일 후 만료
    console.log("Saving token to cookie with expiry date:", expires);
    setCookie("Authorization", token, {
      expires,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
  };

  const saveRefreshTokenToCookie = (refreshToken: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 14); // 14일 후 만료
    console.log("Saving refresh token to cookie with expiry date:", expires);
    setCookie("Refresh", refreshToken, {
      expires,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
  };

  const setupSSEConnection = () => {
    console.log("Setting up SSE connection...");
    const eventSource = new EventSource("http://localhost:8080/api/notify/subscribe", { withCredentials: true });

    eventSource.addEventListener('sse', (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        console.log('Notification received:', data);
        setNotification(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close(); // 오류 발생 시 연결 종료
    };

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 EventSource 정리
    };
  };

  return (
    <>
      <Hero />
      <Features />
      <ModelTest />
      {notification && (
        <div className="notification">
          <p>{notification.message}</p>
        </div>
      )}
    </>
  );
}
