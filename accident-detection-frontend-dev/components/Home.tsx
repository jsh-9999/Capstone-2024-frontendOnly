// components/Home.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from "@/components/mainboard/Hero";
import Features from "@/components/mainboard/Features";
import ModelTest from "@/components/mainboard/ModelTest";
import EventSource from 'eventsource';

interface Notification {
  message: string;
  // 필요한 다른 속성들을 여기에 추가할 수 있습니다.
}

const Home: React.FC = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);

  const setupSSEConnection = (token: string, refreshToken: string) => {
    console.log("Setting up SSE connection...");

    const eventSource = new EventSource("https://backend-capstone.site/api/notify/subscribe", {
      headers: {
        'Authorization': token,
        'Refresh': refreshToken
      },
      withCredentials: true
    });

    eventSource.addEventListener('message', (event) => {
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
