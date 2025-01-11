"use client"
import { useEffect, useRef, useState } from "react";
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import io, { Socket } from "socket.io-client";

let socket: typeof Socket;

const StudyRoom = () => {
  const params = useParams();
  const roomId = params.roomId?.[0];
  const { data: session, status } = useSession();

  const [connectedRoom, setConnectedRoom] = useState("");
  const [peers, setPeers] = useState<{ [key: string]: MediaStream }>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket = io("http://localhost:4000", { allowEIO3: true });

    socket.on("peer-video", ({ userId, stream }: { userId: string, stream: MediaStream }) => {
      setPeers(prev => ({
        ...prev,
        [userId]: stream,
      }));
    });

    socket.on("peer-disconnected", (userId: string) => {
      setPeers(prev => {
        const updatedPeers = { ...prev };
        delete updatedPeers[userId];
        return updatedPeers;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit("join-room", roomId);
      setConnectedRoom(roomId);
    }
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Emit the new user's video stream
      socket.emit("new-user", {
        roomId,
        userId: session?.user.username, // Assuming you use the username as the user ID
        stream,
      });
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  return (
    <div>
      {!connectedRoom ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId || ''}
            onChange={(e) => { /* handle the roomId change */ }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <p>Connected to Room: {connectedRoom}</p>
          <div>
            {/* Video Stream for the current user */}
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ width: "300px", height: "200px", border: "1px solid black" }}
            ></video>
            <button onClick={startVideoStream}>Start Video Call</button>
          </div>

          <div>
            {/* Display peer video streams */}
            {Object.keys(peers).map((userId) => (
              <div key={userId}>
                <p>{userId}</p>
                <video
                  autoPlay
                  style={{ width: "300px", height: "200px", border: "1px solid black" }}
                  ref={(ref) => {
                    if (ref && peers[userId]) {
                      ref.srcObject = peers[userId];
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoom;
