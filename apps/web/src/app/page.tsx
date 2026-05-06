import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getConversations } from "@/app/actions/conversationActions";
import HomeClient from "@/components/home/HomeClient";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    redirect("/auth");
  }

  const initialConversations = await getConversations(session.user.id);

  return (
    <HomeClient
      initialConversations={initialConversations}
      userId={session.user.id}
    />
  );
}
