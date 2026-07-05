"use client";

import { useState } from "react";
import ChatPanel from "@/components/landing/ChatPanel";
import ContactSection from "@/components/landing/ContactSection";
import DoctorsSection from "@/components/landing/DoctorsSection";
import FloatingChatButton from "@/components/landing/FloatingChatButton";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import Services from "@/components/landing/Services";
import Testimonials from "@/components/landing/Testimonials";
import { Doctor } from "@/lib/types";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  function openChat(message?: string) {
    setPendingMessage(message ?? null);
    setIsChatOpen(true);
  }

  function closeChat() {
    setIsChatOpen(false);
    setPendingMessage(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar onBook={() => openChat("I'd like to book an appointment.")} />
      <Hero
        onBook={() => openChat("I'd like to book an appointment.")}
        onTalkToAI={() => openChat()}
      />
      <Services />
      <DoctorsSection onBook={(doctor: Doctor) => openChat(`I'd like to book an appointment with ${doctor.name}`)} />
      <Testimonials />
      <ContactSection />

      {isChatOpen ? (
        <ChatPanel autoSendMessage={pendingMessage} onClose={closeChat} />
      ) : (
        <FloatingChatButton onClick={() => openChat()} />
      )}
    </div>
  );
}
