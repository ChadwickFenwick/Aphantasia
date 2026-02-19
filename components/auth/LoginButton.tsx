
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn()
            }}
        >
            <Button variant="outline" type="submit">
                Sign in
            </Button>
        </form>
    )
}
