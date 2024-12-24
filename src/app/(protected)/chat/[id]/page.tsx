"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CircleUser,
  EllipsisVertical,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { getConversation } from "@/app/actions/chatActions";
interface Message {
  message: string;
  isCurrentUser: boolean;
}

interface IConversation {
  username: string;
  image?: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<IConversation>();

  const handleSendMessage = (newMessage: string) => {
    setMessages([...messages, { message: newMessage, isCurrentUser: true }]);
  };

  const fetchConversation = useCallback(async () => {
    if (id) {
      const conversation = await getConversation(id);

      setConversation(conversation);
    }
  }, [id]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return (
    <>
      <ChatHeader
        username={conversation?.username}
        profileImage={conversation?.image}
        status="Online"
      />
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </>
  );
};

interface ChatHeaderProps {
  profileImage?: string;
  status?: string;
  username?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileImage,
  status,
  username,
}) => {
  return (
    <header className="flex justify-between p-4 items-center text-black">
      <div className="flex gap-2 items-center ">
        <Link href={"/"}>
          <Button size={"box"} variant={"menu"} className="text-black">
            <ArrowLeft />
          </Button>
        </Link>
        <Avatar className="text-black">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            <CircleUser size={60} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{username}</h1>
          <p className="text-sm ">{status}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center ">
          <EllipsisVertical className="text-black" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Block</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

interface chatMessageProps {
  isCurrentUser?: boolean;
  message: string;
}

const ChatMessage: React.FC<chatMessageProps> = ({
  isCurrentUser,
  message,
}) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full flex  px-2",
          isCurrentUser && "justify-end text-end my-2"
        )}
      >
        <div className="rounded-xl overflow-hidden max-w-xs">
          <div
            className={cn("bg-violet-200 p-3", isCurrentUser && "bg-blue-200")}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatInputProps {
  onSendMessage: (newMessage: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <div className=" flex space-x-3  py-3 w-full px-2">
      <Input
        onChange={handleInputChange}
        value={inputValue}
        placeholder="Type a message.."
        className="border-2 w-full rounded-md px-2"
        type="text"
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={handleSendClick}
        className="text-black rounded-sm active:bg-sky-300"
        variant={"menu"}
      >
        <SendHorizontal size={30} />
      </Button>
    </div>
  );
};

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className="flex flex-1 flex-col overflow-auto py-5 pb-3">
      {messages ? (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            isCurrentUser={message.isCurrentUser}
            message={message.message}
          />
        ))
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

export default Page;
