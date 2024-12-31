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
      console.log(res.data);

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
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Bubble */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <span className="text-white text-4xl font-bold">💬</span>
        </button>
      )}

      {/* Expanded Chatbox */}
      {isChatOpen && (
        <div className="w-[95%] sm:w-[600px] h-[80vh] bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 flex justify-between items-center rounded-t-2xl">
            <span className="text-2xl font-bold">College Connect Chat</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-3xl font-bold hover:opacity-80"
            >
              ✖
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-6 bg-gray-900 space-y-6">
            {chat.map((message, index) => (
              <div key={index}>
                {/* User Message */}
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-600 text-white p-5 rounded-lg max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] shadow-md text-lg">
                    {message.userInput}
                  </div>
                </div>
                {/* Bot Response */}
                <div className="flex justify-start mb-4">
                  <div
                    className="bg-gray-700 text-gray-300 p-5 rounded-lg max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] shadow-md text-lg whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: message.response }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-6 bg-gray-800 flex items-center space-x-6">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-6 py-4 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 placeholder-gray-400 text-lg"
            />
            <button
              disabled={isDisabled}
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-opacity"
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
