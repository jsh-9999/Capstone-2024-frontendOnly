'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const GoogleMap = dynamic(() => import("./GoogleMap"), { ssr: false });

type FormProps = {
  image: FileList;
  videoUrl: string;
};

const InputForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormProps>();
  const videoUrl = watch("videoUrl");

  const onSubmitVideoUrl = async (data: any) => {
    try {
      if (!data.videoUrl) return;
      toast("Uploading video URL...");

      const response = await fetch("http://capstone-aiserver.shop/api/v1/public/upload-link", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ video_link: data.videoUrl })
      });

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const responseData = await response.json();
      if (responseData.hls_url) {
        setVideo(responseData.hls_url);
        toast.success("Video URL uploaded successfully!");
      } else if (response.redirected) {
        window.location.href = response.url;
      } else {
        toast.error("Server did not return a valid HLS URL.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message || "Please try again later."}`);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const onSubmitVideoFile = async () => {
    try {
      if (file) {
        toast("Uploading video file...");
        const localVideoUrl = URL.createObjectURL(file);
        setVideo(localVideoUrl);
        const formData = new FormData();
        formData.append("file", file);

        const authToken = localStorage.getItem("Authorization"); // Get the token from local storage

        const uploadResponse = await fetch("http://capstone-aiserver.shop/api/v1/public/upload-video", {
          method: "POST",
          headers: {
            'Authorization': authToken ? `Bearer ${authToken}` : '', // Replace with your actual authorization token
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          toast.error("Failed to upload video.");
        } else {
          toast.success("Video uploaded successfully!");
        }
      } else {
        toast.error("No file selected or invalid file type.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message || "Please try again later."}`);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const onSendLocation = () => {
    setShowMap(true);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      alert(`클릭한 위치의 위도는 ${lat}이고, 경도는 ${lng}입니다.`);
    }
  };

  return (
    <div className="sm:max-w-[900px] min-h-[400px] mx-auto bg-white p-5 border rounded-md">
      <h2 className="text-2xl font-bold pb-5 text-center underline">Input Form</h2>
      <div className="flex flex-col space-y-4">
        {video && (
          <div className="relative w-full min-h-[200px] md:min-h-[400px] border-4 rounded-md border-dashed bg-slate-100 flex items-center justify-center">
            <ReactPlayer 
              url={video} 
              playing 
              controls 
              width="100%" 
              height="100%" 
            />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmitVideoUrl)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
              Real Time RTSP CCTV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("videoUrl", { required: "Video URL is required" })}
              id="videoUrl"
              className="w-full px-4 py-3 rounded-md border outline-none"
              placeholder="Enter video URL"
            />
            <span className="inline-block text-sm text-red-500">
              {errors.videoUrl && errors.videoUrl.message}
            </span>
            <div className="flex justify-between mt-2">
              <Button type="submit" className="font-bold py-2 px-4 bg-blue-500 rounded-md text-white">
                Submit Video URL
              </Button>
              <Button type="button" className="font-bold py-2 px-4 bg-green-500 rounded-md text-white" onClick={onSendLocation}>
                Send Location
              </Button>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit(onSubmitVideoFile)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="image" className="uppercase min-h-[200px] md:min-h-[400px] py-10 border-4 rounded-lg border-dashed bg-slate-100 flex items-center justify-center cursor-pointer">
              {fileName ? `Selected file: ${fileName}` : "Click to upload video file"}
            </label>
            <input
              type="file"
              {...register("image", { required: "Video file is required" })}
              id="image"
              className="hidden"
              accept="video/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const selectedFile = files[0];
                  setFile(selectedFile);
                  setFileName(selectedFile.name);
                  setVideo(URL.createObjectURL(selectedFile)); // Set the video URL
                }
              }}
            />
            <span className="inline-block text-sm text-red-500">
              {errors.image && errors.image.message}
            </span>
            <Button type="submit" className="font-bold py-4 px-8 bg-gray-900 rounded-md text-white w-full">
              Submit this Video
            </Button>
          </div>
        </form>
      </div>
      {showMap && (
        <div style={{ width: '100%', height: '350px', marginTop: '20px' }}>
          <GoogleMap onMapClick={handleMapClick} />
        </div>
      )}
    </div>
  );
};

export default InputForm;
