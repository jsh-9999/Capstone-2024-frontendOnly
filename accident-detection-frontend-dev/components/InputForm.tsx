"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EventSourcePolyfill } from 'event-source-polyfill';

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type FormProps = {
  image: FileList;
  videoUrl: string;
};

const InputForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<FormProps>();

  const videoUrl = watch("videoUrl");

  const getTokens = () => {
    const token = localStorage.getItem("Authorization");
    const refreshToken = localStorage.getItem("Refresh");
    return { token, refreshToken };
  };

  const onSubmitVideoUrl = async (data: any) => {
    if (!data.videoUrl) return;

    setVideo(data.videoUrl);

    const { token, refreshToken } = getTokens();

    const response = await fetch("http://127.0.0.1:5000/api/v1/public/upload-link", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
        'Refresh': refreshToken || ''
      },
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

      const { token, refreshToken } = getTokens();

      const uploadResponse = await fetch("http://127.0.0.1:5000/api/v1/public/upload-video", {
        method: "POST",
        headers: {
          'Authorization': token || '',
          'Refresh': refreshToken || ''
        },
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

  // Handler for sending location
  const onSendLocation = () => {
    // Logic to send location goes here
    console.log("Location sending logic here");
  };

  return (
    <main className="max-w-[900px] min-h-[400px] mx-auto">
      {video ? (
        <div className="w-full min-h-[200px] md:min-h-[400px] border-4 rounded-md border-dashed p-1">
          <ReactPlayer url={video} playing width="100%" height="100%" />
        </div>
      ) : (
        <>
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
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="font-bold py-2 px-4 bg-blue-500 rounded-md text-white"
                >
                  Submit Video URL
                </button>
                <button
                  type="button" // This should be `type="button"` to prevent form submission
                  className="font-bold py-2 px-4 bg-green-500 rounded-md text-white"
                  onClick={onSendLocation}
                >
                  Send Location
                </button>
              </div>
            </div>
          </form>
          <form onSubmit={handleSubmit(onSubmitVideoFile)}>
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
          {video && (
            <div id="videoModal" className="video-modal">
              <ReactPlayer url={video} playing width="100%" height="100%" />
              <button onClick={() => setVideo(null)}>Close</button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default InputForm;
