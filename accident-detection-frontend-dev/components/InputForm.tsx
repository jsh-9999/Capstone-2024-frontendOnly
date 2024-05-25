"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type FormProps = {
  image: FileList;
  videoUrl: string;
};

const InputForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, watch } = useForm<FormProps>();

  const videoUrl = watch("videoUrl");

  const onSubmitVideoUrl = async (data: any) => {
    if (!data.videoUrl) return;

    setVideo(data.videoUrl);

    const response = await fetch("http://127.0.0.1:5000/api/v1/public/upload-link", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_link: data.videoUrl })
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }
    const responseData = await response.json();
    if (responseData.hls_url) {
      setVideo(responseData.hls_url);
    } else if (response.redirected) {
      window.location.href = response.url;
    } else {
      console.error("Server did not return a valid HLS URL.");
    }
  };

  const onSubmitVideoFile = async () => {
    if (file) {
      const localVideoUrl = URL.createObjectURL(file);
      setVideo(localVideoUrl);
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResponse = await fetch("http://127.0.0.1:5000/api/v1/public/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error("Failed to upload video.");
      } else {
        console.log("Video uploaded successfully.");
      }
    } else {
      console.error("No file selected or invalid file type.");
    }
  };

  const onSendLocation = () => {
    setShowMap(true);
  };

  useEffect(() => {
    if (showMap && mapRef.current) {
      const google = window.google;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          alert(`클릭한 위치의 위도는 ${lat}이고, 경도는 ${lng}입니다.`);
        }
      });
    }
  }, [showMap]);

  return (
    <main className="max-w-[900px] min-h-[400px] mx-auto">
      <div className="flex flex-col space-y-4">
        <form onSubmit={handleSubmit(onSubmitVideoUrl)} className="space-y-4">
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
              Real Time RTSP CCTV
            </label>
            <input
              type="text"
              {...register("videoUrl")}
              id="videoUrl"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter video URL"
            />
            <div className="flex justify-between mt-2">
              <button
                type="submit"
                className="font-bold py-2 px-4 bg-blue-500 rounded-md text-white"
              >
                Submit Video URL
              </button>
              <button
                type="button"
                className="font-bold py-2 px-4 bg-green-500 rounded-md text-white"
                onClick={onSendLocation}
              >
                Send Location
              </button>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit(onSubmitVideoFile)} className="space-y-4">
          <div>
            <label htmlFor="image" className="uppercase min-h-[200px] md:min-h-[400px] py-10 border-4 rounded-lg border-dashed bg-slate-100 flex items-center justify-center cursor-pointer">
              {fileName ? `Selected file: ${fileName}` : "Click to upload video file"}
            </label>
            <input
              type="file"
              {...register("image")}
              id="image"
              className="hidden"
              accept="video/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const selectedFile = files[0];
                  setFile(selectedFile);
                  setFileName(selectedFile.name);
                }
              }}
            />
            <button
              type="submit"
              className="font-bold py-4 px-8 bg-gray-900 rounded-md text-white w-full"
            >
              Submit this Video
            </button>
          </div>
        </form>
      </div>
      {showMap && (
        <div ref={mapRef} style={{ width: '100%', height: '350px', marginTop: '20px' }}></div>
      )}
      {video && (
        <div className="w-full min-h-[200px] md:min-h-[400px] border-4 rounded-md border-dashed p-1 mt-4">
          <ReactPlayer url={video} playing width="100%" height="100%" />
        </div>
      )}
    </main>
  );
};

export default InputForm;
