"use client"
import {useEffect} from "react";
import axios from "axios";
import {useModel} from "../../../hooks/user-model-store";
import {useRouter} from "next/navigation";

export default function FriendsPage() {
  const { friends, setFriends, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends`);
        if (res.status === 200) {
          setFriends(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setFriends, setLoading, router]);

  if (!friends) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col h-screen w-full bg-gray-800">

      </div>
    </>
  )
}