"use client"
import { useState } from "react";
import axios from "axios";

interface Chat {
  userInput: string;
  response: string;
}

const FloatingChatbot = () => {
  const [chat, setChat] = useState<Chat[]>([
    { userInput: "Hi!", response: "Hello! How can I assist you today?" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setIsDisabled(true);

    try {
      setChat((chat) => [...chat, {userInput: userMessage, response: "fetching response..."}]);
      const res = await axios.post("/api/aichatbot", {userInput: userMessage});

      if (res.status === 200) {
        setChat((prev) => {
          const updatedChat = [...prev];
          updatedChat[updatedChat.length - 1].response = res.data;
          return updatedChat;
        });

        setUserMessage("");
      } else {
        setChat((prev) => {
          const updatedChat = [...prev];
          updatedChat[updatedChat.length - 1].response = "Failed to fetch response";
          return updatedChat;
        });
      }
    } catch (error) {
      console.log(error);
    }

    setIsDisabled(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      {/* Chat Bubble */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="text-white text-2xl font-bold">💬</span>
        </button>
      )}

      {/* Expanded Chatbox */}
      {isChatOpen && (
        <div className="w-80 h-[500px] bg-gray-800 rounded-xl shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 flex justify-between items-center rounded-t-xl">
            <span className="text-lg font-bold">College Connect Chat</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-xl font-bold hover:opacity-80"
            >
              ✖
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-900 space-y-4">
            {chat.map((message, index) => (
              <div key={index}>
                {/* User Message */}
                <div className="flex justify-end mb-2">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[75%]">
                    {message.userInput}
                  </div>
                </div>
                {/* Bot Response */}
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-300 p-3 rounded-lg max-w-[75%]">
                    {message.response}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-4 bg-gray-800 flex items-center space-x-4">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              disabled={isDisabled}
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
