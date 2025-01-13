'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { MediaRoom } from '@/components/avcall/media-room';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

let socket: typeof Socket;

const StudyRoom = () => {
    const params = useParams();
    const roomId = params.roomId?.[0];
    const { data: session, status } = useSession();
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (!showWhiteboard) return;

        socket = io('http://localhost:4000', {
            allowEIO3: true,
        });

        // Listen for whiteboard updates
        socket.on("whiteboard-update", (data) => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (ctx && data) {
            const { x, y, type } = data;
            if (type === "start") {
              ctx.beginPath();
              ctx.moveTo(x, y);
            } else if (type === "draw") {
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
        });

        socket.on("ondown", ({x,y}) => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (ctx) {
            ctx.moveTo(x, y);
          }
        });

        return () => {
            socket.disconnect();
        };
    }, [showWhiteboard]);

    const handleMouseDown = (e: React.MouseEvent) => {
      isDrawing.current = true;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        const { offsetX, offsetY } = e.nativeEvent;
        lastPoint.current = { x: offsetX, y: offsetY }; // Store the start point
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
  
        socket.emit('down', roomId, { x: offsetX, y: offsetY });
        socket.emit("whiteboard-update", { roomId, x: offsetX, y: offsetY, type: "start" });
      }
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDrawing.current || !lastPoint.current) return;
  
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        socket.emit("whiteboard-update", { roomId, data: { x: offsetX, y: offsetY, type: "draw" } });
        lastPoint.current = { x: offsetX, y: offsetY }; // Update the last point as the new position
      }
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
      lastPoint.current = null; // Reset the last point when drawing ends
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <MediaRoom roomId={roomId as string} studentName={session?.user.username as string} />

            <button
                onClick={() => setShowWhiteboard(!showWhiteboard)}
                style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
            >
                {showWhiteboard ? 'Close Whiteboard' : 'Start Whiteboard'}
            </button>

            {showWhiteboard && (
                <div>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        style={{ border: '1px solid black', marginTop: '10px' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                </div>
            )}
        </div>
    );
};

export default StudyRoom;
