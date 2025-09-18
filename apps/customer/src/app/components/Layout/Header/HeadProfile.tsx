import { useGeneralContext } from "@/hooks/GeneralHook";
import { useMutation } from "@tanstack/react-query";
import BookingList from "./BookingList";
import axios from "axios";

export default function HeadProfile() {
  const { user, setUser, setIsLogInOpen } = useGeneralContext();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      ),
    onSuccess: () => {
      localStorage.removeItem("user");
      setUser(null);
      setIsLogInOpen(false);
    },
  });

  return (
    <div className="flex items-center gap-5">
      <BookingList />
      <button
        onClick={() => mutate()}
        className="hidden lg:block bg-transparent text-primary border hover:bg-primary border-primary hover:text-white duration-300 px-6 py-2 rounded-lg hover:cursor-pointer"
      >
        {isPending ? "Logging you out..." : "Logout"}
      </button>
    </div>
  );
}
