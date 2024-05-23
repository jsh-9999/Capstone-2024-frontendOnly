// components/Home.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from "@/components/mainboard/Hero";
import Features from "@/components/mainboard/Features";
import ModelTest from "@/components/mainboard/ModelTest";
import { EventSourcePolyfill } from 'event-source-polyfill';

const Home = () => {
  const router = useRouter();
  const [notification, setNotification] = useState(null);

  const setupSSEConnection = (token, refreshToken) => {
    console.log("Setting up SSE connection...");

    const eventSource = new EventSourcePolyfill("https://backend-capstone.site/api/notify/subscribe", {
      headers: {
        'Authorization': token,
        'Refresh': refreshToken
      },
      withCredentials: true
    });

    eventSource.addEventListener('open', () => {
      console.log('SSE connection opened');
    });

    eventSource.addEventListener('message', (event) => {
      try {
        console.log('Raw event data:', event.data); // Raw event data 확인
        const data = JSON.parse(event.data);
        console.log('Notification received:', data);
        setNotification(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    eventSource.addEventListener('error', (error) => {
      if (error.readyState === EventSource.CLOSED) {
        console.log('SSE connection was closed');
      } else {
        console.error('SSE error:', error);
      }
      eventSource.close(); // 오류 발생 시 연결 종료
    });

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 EventSource 정리
      console.log('SSE connection closed');
    };
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("Authorization");
      const refreshToken = localStorage.getItem("Refresh");
      console.log("Token:", token);
      console.log("Refresh Token:", refreshToken);

      if (!token || !refreshToken) {
        console.log("No token found, redirecting to login page.");
        router.push('/auth/login');
      } else {
        // SSE 연결 설정하여 알림 수신
        const cleanup = setupSSEConnection(token, refreshToken);
        return cleanup;
      }
    }
  }, []);

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

export default Home;
