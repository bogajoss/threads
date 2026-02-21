import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreHorizontal, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypingIndicator } from "@/components/ui";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "@/lib/api/storage";
import { formatTimeAgo } from "@/lib/utils";
import { useMobileViewport } from "@/hooks/useMobileViewport";

interface ChatWindowProps {
  conversation: any;
  messages: any[];
  currentUser: any;
  onBack: () => void;
  onSendMessage: (
    convId: string,
    text: string,
    type: string,
    attachments: any[],
    replyToId?: string
  ) => void;
  onEditMessage?: (msgId: string, text: string) => void;
  onDeleteMessage?: (msgId: string) => void;
  onToggleReaction?: (msgId: string, emoji: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  isTyping: boolean;
  isOnline: boolean;
}

const ChatWindow = ({
  conversation,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onToggleReaction,
  onTyping,
  isLoading,
  isTyping,
  isOnline,
}: ChatWindowProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const { height: viewportHeight, keyboardOpen } = useMobileViewport();

  // Adjust scroll on keyboard open
  useEffect(() => {
    if (keyboardOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
  }, [keyboardOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const displayName = conversation.isGroup ? conversation.name : conversation.user?.name;
  const displayAvatar = conversation.isGroup ? conversation.avatar : conversation.user?.avatar;

  const handleSend = async (text: string, attachments: File[], audioBlob: Blob | undefined) => {
    if (editingMessage) {
      onEditMessage?.(editingMessage.id, text);
      setEditingMessage(null);
      return;
    }

    let uploadedMedia: any[] = [];
    let type = "text";

    try {
      // Upload attachments
      if (attachments.length > 0) {
        const uploads = await Promise.all(attachments.map(file => uploadFile(file)));
        uploadedMedia = uploads;
        type = uploads[0].type === "video" ? "video" : "image";
      }

      // Upload audio
      if (audioBlob) {
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        const upload = await uploadFile(audioFile);
        uploadedMedia.push(upload);
        type = "voice";
      }
    } catch (error) {
      console.error("Failed to upload media:", error);
      // Ideally show a toast here
      return;
    }

    onSendMessage(
      conversation.id,
      text,
      type,
      uploadedMedia,
      replyingTo?.id
    );
    setReplyingTo(null);
  };

  return (
    <div
      className="flex w-full flex-col bg-white dark:bg-[#09090b] relative overflow-hidden"
      style={{ height: `${viewportHeight}px` }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-[#09090b]/80 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-2"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </Button>

          <div className="relative cursor-pointer" onClick={() => conversation.user && navigate(`/u/${conversation.user.handle}`)}>
            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback>{displayName?.[0]}</AvatarFallback>
            </Avatar>
            {isOnline && !conversation.isGroup && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-[2px] border-white bg-emerald-500 dark:border-zinc-950" />
            )}
          </div>

          <div
            className="flex flex-col cursor-pointer"
            onClick={() => conversation.user && navigate(`/u/${conversation.user.handle}`)}
          >
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
              {displayName}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {(() => {
                if (conversation.isGroup) return `${conversation.members?.length || 0} members`;
                if (isOnline) return "Active now";
                
                if (conversation.user?.lastSeen) {
                  const lastSeenDate = new Date(conversation.user.lastSeen);
                  if (!isNaN(lastSeenDate.getTime())) {
                    const diff = new Date().getTime() - lastSeenDate.getTime();
                    if (diff < 60000) return "Active now";
                    return `Last seen ${formatTimeAgo(conversation.user.lastSeen)}`;
                  }
                }
                
                return "Offline";
              })()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-zinc-50/50 dark:bg-[#09090b]">
        {/* We use a ref on a div inside ScrollArea to manipulate scroll position manually */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto p-4 flex flex-col gap-1 pb-[100px] md:pb-[100px]" // Add extra padding for fixed input
          style={{ overscrollBehavior: "contain" }}
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center opacity-50">
              <Avatar className="h-24 w-24 grayscale opacity-50">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback>{displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">Say hello!</h3>
                <p className="text-sm">Start the conversation with {displayName.split(" ")[0]}.</p>
              </div>
            </div>
          )}

          {isLoading && messages.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-500">Loading messages...</div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender === "me" || msg.sender_id === currentUser.id;
            const isLastInGroup = i === messages.length - 1 || messages[i + 1]?.sender !== msg.sender;
            const showAvatar = !isMe && isLastInGroup;

            return (
              <Message
                key={msg.id || i}
                message={msg}
                isMe={isMe}
                isLastInGroup={isLastInGroup}
                showAvatar={showAvatar}
                onReply={setReplyingTo}
                onEdit={isMe ? () => setEditingMessage(msg) : undefined}
                onDelete={isMe ? onDeleteMessage : undefined}
                onReaction={onToggleReaction}
              />
            );
          })}

          {isTyping && (
            <div className="flex items-end gap-2 mb-2 ml-10">
              <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800 rounded-tl-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Fixed Input Area */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#09090b] border-t border-zinc-100 dark:border-zinc-800 transition-transform duration-100 ease-out md:absolute md:transform-none"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--keyboard-height, 0px))',
          // For mobile, if we are in a portal/modal or standalone, this fixed positioning is key.
          // But we need to check if we are inside the Messages page layout which might constrain width.
          // Since this is ChatWindow, it is often rendered inside MainLayout -> Outlet or similar.
          // If we use fixed, it breaks out of the parent container width on Desktop unless we constrain it.
          // The "md:absolute" helps for desktop if the parent is relative.
        }}
      >
        <div className="w-full max-w-[1500px] mx-auto md:max-w-none">
          <ChatInput
            onSendMessage={handleSend}
            onTyping={onTyping}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
