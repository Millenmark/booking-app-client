"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
// import SocialSignIn from "../SocialSignIn";
import Logo from "@/app/components/Layout/Header/Logo";
import Loader from "@/app/components/Common/Loader";
import { useGeneralContext } from "@/hooks/GeneralHook";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  TextField,
  IconButton,
  InputAdornment,
  FormHelperText,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { headers } from "next/headers";

const Signin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsRegisterOpen, setIsLogInOpen, setUser, showSnackbar } =
    useGeneralContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (loginData: { email: string; password: string }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      loginData,
      {
        headers: {
          "X-Api-Key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      }
    );
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ data: { name }, token }) => {
      setUser({ name: name, token });
      localStorage.setItem("user", JSON.stringify({ name: name, token }));
      setIsLogInOpen(false);
      router.push("/");
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || "Cancellation failed"
        : "Cancellation failed";
      showSnackbar(message, "error");
    },
  });

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate(loginData);
        }}
      >
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black"
          />
        </div>
        <div className="mb-[22px]">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="bg-primary w-full py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out"
          >
            {isPending ? "Logging you in..." : "Login"}
          </button>
        </div>
      </form>

      <Link
        href="/forgot-password"
        className="mb-2 inline-block text-base text-primary hover:underline"
        onClick={() => setIsLogInOpen(false)}
      >
        Forgot Password?
      </Link>
      <p className="text-body-secondary text-black text-base">
        Not a member yet?{" "}
        <button
          onClick={() => {
            setIsRegisterOpen(true);
            setIsLogInOpen(false);
          }}
          className="text-primary hover:underline"
        >
          Register
        </button>
      </p>
    </>
  );
};

export default Signin;
