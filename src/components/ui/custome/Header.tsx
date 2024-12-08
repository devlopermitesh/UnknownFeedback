"use client"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { Button } from "../button"
import favicon from "../../../../public/favicon.png"
import Image from "next/image"
import Link from "next/link"

const Header = () => {
  const { data: session, status } = useSession()
  const user: User = session?.user as User

  return (
    <div className="w-full h-16 bg-slate-100 text-black flex items-center justify-between py-2 shadow-sm">
      <div className="flex items-center">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={favicon}
            alt="UnknownFeedback"
            layout="intrinsic"
            width={64}
            height={64}
            className="rounded-full border-white"
            priority
            objectFit="cover"
          />
        </div>
        <Link href="/" className="text-lg font-bold m-2">
          Unknown Feedback
        </Link>
      </div>
      {status === "authenticated" && session ? (
        <div>
          {/* Removed the <a> tag here */}
          <Link href="/dashboard" className="font-sans text-lg">
            Welcome ! {user.name}
          </Link>
        </div>
      ) : (
        <div>
          <Link href="/sign-in">
            <Button className="text-lg font-bold bg-black text-white border-white border-2 border-solid">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
