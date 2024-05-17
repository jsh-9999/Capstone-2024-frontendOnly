"use client";
import React, { useState } from "react";
import { SimpleChart } from "@/components/charts/SimpleChart";
import CustomChart from "@/components/charts/CustomChart";
import { useQuery } from "@tanstack/react-query";

type Props = {};

export default function Page({}: Props) {
  const [selectedOption, setSelectedOption] = useState("월별");

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <h2 className="text-xl sm:text-2xl pb-5 font-bold underline">
        Accidents Overview (Per month)
      </h2>
      <div className="relative inline-block text-left">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <option value="월별">월별</option>
          <option value="지역별">지역별</option>
        </select>
      </div>
      {selectedOption === "월별" ? (
        <SimpleChart /> // 월별 그래프 컴포넌트
      ) : (
        <CustomChart /> // 지역별 그래프 컴포넌트
      )}
    </>
  );
}
