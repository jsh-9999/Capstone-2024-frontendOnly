"use client";
import { SimpleChart } from "@/components/charts/SimpleChart";
import CustomChart from "@/components/charts/CustomChart";
import { useQuery } from "@tanstack/react-query";

type Props = {};
export default function Page({}: Props) {
  
  return (
    <>
      {/* <SimpleChart /> */}
      <h2 className="text-xl sm:text-2xl pb-5 font-bold underline">
        Accidents Overview(Per month)
      </h2>
      
    </>
  );
}