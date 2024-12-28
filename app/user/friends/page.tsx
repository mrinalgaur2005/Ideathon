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
        console.error("Error fetching friends", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setFriends, setLoading, router]);

  if (!friends) {
    return <div className="h-screen w-full bg-gray-800">Loading...</div>;
  }

  async function removeFriend (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/add-friends/${to}/${from}`)

      if (res.status === 200 && friends) {
        setFriends({
          _id: friends._id,
          friends: friends.friends.filter(friend => friend._id.toString() !== from),
        });
      }
    } catch (error) {
      console.error("Failed to remove friend", error);
    } finally {
      setLoading(false);
    }

  }


  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        {friends.friends.map((friend) =>
          <div key={friend._id.toString()}
               className="flex flex-row w-1/2 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around text-white text-lg font-bold">
            <img src={friend.profile} className="w-16 h-16 rounded-full object-contain bg-white"/>
            <div>
              {friend.name}
            </div>
            <div>
              {friend.student_id}
            </div>
            <button
              className="bg-red-700 text-white h-14 w-48 rounded-full"
              onClick={() => removeFriend(friends._id.toString(), friend._id.toString())}
            >
              Remove friend
            </button>
          </div>
        )}
      </div>
    </>
  )
}