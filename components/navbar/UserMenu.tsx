"use client";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
//import { signIn } from "next-auth/react";
import SignInForm from "@/app/(auth)/sign-in/page";
import SignUpForm from "@/app/(auth)/sign-up/page";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const router = useRouter();

  const navigateToSignIn = () => {};

  const navigateToSignUp = () => {};

  return (
    <div className="relative z-20 ml-4">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden md:block text-white text-sm font-semibold py-3 px-4 rounded-full hover:bg-blue-600 hover:text-white transition cursor-pointer">
          Ayush Kashyap
        </div>

        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition hover:scale-105 text-lg"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute
            rounded-xl
            shadow-md
            w-[50vw]  
            md:w-3/4
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            <a
              href="/sign-in"
              className="py-2 px-4 text-black hover:bg-gray-200 text-left font-bold"
            >
              Login
            </a>
            <a
              href="/sign-up"
              className="py-2 px-4 text-black hover:bg-gray-200 text-left font-bold"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
