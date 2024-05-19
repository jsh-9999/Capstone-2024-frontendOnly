"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import Hero from "@/components/mainboard/Hero";
import Features from "@/components/mainboard/Features";
import ModelTest from "@/components/mainboard/ModelTest";

export default function Home() {
  const router = useRouter();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = getCookie("Authorization");
    const refreshToken = getCookie("Refresh");
    if (!token || !refreshToken) {
      router.push('/auth/login');
    } else {
      // 쿠키에 토큰 저장
      saveTokenToCookie(token as string);
      saveRefreshTokenToCookie(refreshToken as string);
      // SSE 연결 설정하여 알림 수신
      setupSSEConnection();
    }
  }, [router]);

  const saveTokenToCookie = (token : string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7일 후 만료
    setCookie("Authorization", token, {
      expires,
      path: '/',
    });
  };

  const saveRefreshTokenToCookie = (refreshToken : string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 14); // 14일 후 만료
    setCookie("Refresh", refreshToken, {
      expires,
      path: '/',
    });
  };

  const setupSSEConnection = () => {
    const eventSource = new EventSource("http://localhost:8080/api/notify/subscribe", { withCredentials: true });

    eventSource.addEventListener('sse', (event) => {
      try {
        // JSON 파싱을 시도하기 전에 데이터가 JSON인지 확인
        const data = JSON.parse(event.data);
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
