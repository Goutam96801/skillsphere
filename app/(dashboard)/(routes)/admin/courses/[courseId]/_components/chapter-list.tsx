"use client";

import axios from "axios";
import { Grip } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dotenv from "dotenv";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NextResponse } from "next/server";


dotenv.config();

interface ChaptersListProps {
  courseId: string;
  playlistUrl: string | null;
}

interface Video {
  videoId: string;
  title: string;
}

export const ChaptersList: React.FC<ChaptersListProps> = ({ courseId, playlistUrl }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSaving, setIsSaving] = useState(false); // Add state for saving

  const router = useRouter();

  const apiKey = process.env.YOUTUBE_API_KEY;

  // useEffect(() => {
  //   if (playlistUrl) {
  //     const regex = /list=([A-Za-z0-9_\-]+)/;
  //     const match = playlistUrl.match(regex);

  //     if (match && match[1]) {
  //       const playlistId = match[1];
  //       console.log(match[1])

  //       // Fetch the playlist page and parse the video data
  //       fetch(
  //         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
  //       )
  //         .then((response) => response.json()) // Parse the response as JSON
  //         .then(async (data) => {
  //           if (data.items && data.items.length > 0) {
  //             // Specify the type of 'item' as returned by the YouTube Data API
  //             const videoList = data.items.map((item: any) => {
  //               const title = item.snippet.title || 'Untitled Video';
  //               return {
  //                 videoId: item.snippet.resourceId.videoId,
  //                 title: title,
                  
  //               };
                
  //             });
  //             setVideos(videoList);
  //           }
  //         }) 
  //         .catch((error) => {
  //           console.error("Error fetching playlist page:", error);
  //         });

  //     }
  //   }
  // }, [playlistUrl]);

  useEffect(() => {

    const fetchPlaylistVideos = async (playlistId:any) => {
      let nextPageToken = '';
      const fetchedVideos: Video[] = [];

      try {
        while (true) { // Keep fetching pages until there are no more to fetch
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
              part: 'snippet',
              maxResults: 50,
              playlistId: playlistId,
              key: apiKey,
              pageToken: nextPageToken,
            },
          });

          response.data.items.forEach((item:any) => {
            fetchedVideos.push({
              videoId: item.snippet.resourceId.videoId,
              title: item.snippet.title,
            });
          });

          nextPageToken = response.data.nextPageToken;
          if (!nextPageToken) {
            break;
          }
        }

        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching playlist videos:", error);
      }
    };

    if (playlistUrl) {
      const regex = /list=([A-Za-z0-9_\-]+)/;
      const match = playlistUrl.match(regex);

      if (match) {
        fetchPlaylistVideos(match[1]);
      }
    }
  }, [playlistUrl, apiKey]);

  const saveChapters = async () => {
    try {
      setIsSaving(true);
      const chaptersToSave = videos.map((video) => ({
        courseId: courseId,
        title: video.title,
        videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      }));
      
      
      // Send a POST request to save chapters
      await axios.post(`/api/courses/${courseId}/chapters`, chaptersToSave);
      toast.success("Chapters saved");
    } catch (error) {
      if(NextResponse.json(409)){
        toast("Chapter already exist", {icon: '🤦‍♂️'})
      }else{
      toast.error("Something went wrong");
      }
    } finally {
      setIsSaving(false);
      router.refresh();
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course chapters
      </div>
      <div className="text-sm mt-2 max-h-[250px] overflow-auto">
        {videos.map((video, index) => (
          <div key={index}>
            <div className="flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm">
              <div className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition">
                <Grip className="h-5 w-5" />
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {index + 1}: {video.title}
              </a>
            </div>
          </div>
        ))}
      </div>
      <Button
          onClick={saveChapters}
          disabled={videos.length === 0 || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
    </div>
  );
};
