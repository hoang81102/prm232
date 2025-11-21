import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { fetchMe, getUserInfo } from "../../api/authApi";
import type { Message } from "../../types/disputes";
import { sendMessage } from "../../api/disputeApi";
import dayjs from "dayjs";
interface Props {
  disputeId: number;
  messages: Message[];
  onMessageSent: () => void; // Callback để reload tin nhắn
}

export const DisputeChatBox = ({ disputeId, messages, onMessageSent }: Props) => {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<{ userId: number } | null>(null);
  

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchMe();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;
    
    setSending(true);
    const success = await sendMessage(disputeId, content);
    if (success) {
      setContent("");
      onMessageSent();
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl bg-gray-50 overflow-hidden">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">Chưa có tin nhắn nào.</p>
        ) : (
          messages.map((msg, idx) => {
            // Xác định xem tin nhắn là của mình hay người khác
            // Lưu ý: Cần đảm bảo logic so sánh ID đúng (string/number)
            const isMe = Number(currentUser?.userId) === msg.senderUserId;
            
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {!isMe && <p className="text-xs font-bold text-gray-500 mb-1">User #{msg.senderUserId}</p>}
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                    {dayjs(msg.sentAt).format("DD-MM-YYYY") || "N/A"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex gap-2">
        <Input
          placeholder="Nhập tin nhắn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
          className="flex-1"
        />
        <Button 
            onClick={handleSend} 
            disabled={sending || !content.trim()} 
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};