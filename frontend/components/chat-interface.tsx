"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useSharedContext } from "@/lib/shared-context";

export function ChatInterface() {
  const { prData } = useSharedContext()
  return (
    <div className="flex h-full w-80 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <h2 className="font-semibold">EnterpriseX Assistant</h2>
      </div>
      <CopilotChat className="h-full"
        instructions={`You are a helpful assistant that can help the user with their questions and tasks. Always assume username is "Jon Snow". If user asks someone's PR dont show the data in just text, use GetPRDataForAUser tool to show the data in pie-chart. When searching for a user's PR data, use the following data:  ${JSON.stringify(prData)}`}
      />
    </div>
  )
}
