"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { setCookie } from 'cookies-next';
import Image from "next/image";
import InputForm from "@/components/InputForm";
import Hero from "@/components/mainboard/Hero";
import Features from "@/components/mainboard/Features";
import ModelTest from "@/components/mainboard/ModelTest";

export default function Home() {
  const router = useRouter();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = getCookie("Authorization");
    if (!token) {
        router.push('/auth/login');
    } else {
        // Fetch notification data when token is available
        fetchNotification();
    }
  }, [router]);

  const saveTokenToCookie = (token) => {
    setCookie("Authorization", token, {
      expires: 7,
      path: '/',
    });
  };
  const saveRefreshTokenToCookie = (refreshToken) => {
    setCookie("Refresh", refreshToken, {
      expires: 14,
      path: '/',
    });
  };

  const fetchNotification = async () => {
    try {
      const token = getCookie("Authorization");
      const refreshToken = getCookie("Refresh"); // Corrected to retrieve refresh token
      const response = await fetch("http://localhost:8080/api/notify/subscribe", {
        credentials: 'include', // Include cookies in the request
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const eventData = await response.json(); // Assuming the response contains notification data
      setNotification(eventData);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
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
