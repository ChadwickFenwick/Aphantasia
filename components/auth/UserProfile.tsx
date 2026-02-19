"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { LogIn, User, Settings, LogOut, ChevronsUpDown } from "lucide-react"
import Link from "next/link"

export function UserProfile() {
    const { data: session, status } = useSession()

    // Loading state can be a subtle pulse or just null
    if (status === "loading") {
        return <div className="h-10 w-full animate-pulse bg-white/5 rounded-lg" />
    }

    if (!session?.user) {
        return (
            <Button
                onClick={() => signIn()}
                className="w-full justify-start gap-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:text-white transition-all h-10 shadow-[0_0_15px_-5px_var(--color-primary)]"
            >
                <div className="p-1 bg-primary/20 rounded">
                    <LogIn className="w-4 h-4" />
                </div>
                Connect Account
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left outline-none group">
                    <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {session.user.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {session.user.name}
                        </p>
                        <p className="truncate text-[10px] text-muted uppercase tracking-wider">
                            {session.user.email}
                        </p>
                    </div>

                    <ChevronsUpDown className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 bg-black/90 backdrop-blur-xl border-white/10 text-white shadow-2xl"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild>
                    <Link href="/progress" className="w-full cursor-pointer focus:bg-white/10 focus:text-white group">
                        <User className="w-4 h-4 mr-2 text-muted group-hover:text-primary transition-colors" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full cursor-pointer focus:bg-white/10 focus:text-white group">
                        <Settings className="w-4 h-4 mr-2 text-muted group-hover:text-cyan-400 transition-colors" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer group"
                >
                    <LogOut className="w-4 h-4 mr-2 group-hover:text-red-500 transition-colors" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
