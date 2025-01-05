import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (newMessage: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
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
    <div className="flex space-x-3 py-3 w-full px-2">
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

export default MessageInput;
