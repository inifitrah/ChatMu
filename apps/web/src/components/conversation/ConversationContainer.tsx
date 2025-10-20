import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { ISelectedConversation } from "@chatmu/shared";
import { useConversationActions } from "@/contexts/ConversationContext";
import { useAppSelector } from "@/hooks/use-dispatch-selector";
import useMessageHandling from "@/hooks/useMessageHandling";
interface ConversationContainerProps {
  conversation: ISelectedConversation;
}

const ConversationContainer = ({
  conversation,
}: ConversationContainerProps) => {
  const { setSelectedConversation } = useConversationActions();
  const isOnline = useAppSelector((state) =>
    state.user.onlineUsers.find((user) => user.userId === conversation.userId)
  );

  const { messages, handleSendMessage } = useMessageHandling(conversation);

  return (
    <section className="fixed wrapper-page inset-0 z-50 flex flex-col">
      <ConversationHeader
        backButtonClick={() => setSelectedConversation(null)}
        username={conversation.username}
        profileImage={conversation.profileImage}
        status={isOnline ? "online" : "offline"}
      />
      <MessageContainer messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </section>
  );
};

export default ConversationContainer;
