"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
// import SocialSignUp from "../SocialSignUp";
import Logo from "@/app/components/Layout/Header/Logo";
import { useState, FormEvent } from "react";
import Loader from "@/app/components/Common/Loader";
import { useGeneralContext } from "@/hooks/GeneralHook";
import {
  TextField,
  IconButton,
  InputAdornment,
  FormHelperText,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const router = useRouter();
  const { setIsLogInOpen, setIsRegisterOpen, setUser } = useGeneralContext();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMatch =
    registerData.confirmPassword === registerData.password ||
    registerData.confirmPassword === "";

  type RegisterVariables = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  type RegisterResponse = {
    message: string;
    data: { name: string };
    token: string;
  };

  const { mutate, isError, error } = useMutation<
    RegisterResponse,
    AxiosError<{ message: string }>,
    RegisterVariables
  >({
    mutationFn: async (payload: RegisterVariables) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        { ...payload, password_confirmation: payload.confirmPassword },
        {
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
      return data;
    },
    onSuccess: ({ data, token }) => {
      setIsRegisterOpen(false);
      setUser({ name: data.name, token });
      localStorage.setItem("user", JSON.stringify({ name: data.name, token }));
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(registerData);
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black"
          />
        </div>
        <div className="mb-[22px]">
          <input
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black"
          />
        </div>
        <div className="mb-[22px]">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
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

        <div className="mb-[22px]">
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={registerData.confirmPassword}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              })
            }
            required
            fullWidth
            error={!isMatch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center text-18 font-medium justify-center rounded-md  text-white bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border hover:cursor-pointer"
          >
            Register {loading && <Loader />}
          </button>
        </div>
      </form>
      {isError && error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>
            {(error.response?.data as any)?.message ||
              "An error occurred. Please try again."}
          </p>
        </div>
      )}

      <p className="text-body-secondary text-black text-base">
        Already have an account?
        <button
          onClick={() => {
            setIsLogInOpen(true);
            setIsRegisterOpen(false);
          }}
          className="pl-2 text-primary hover:underline"
        >
          Login
        </button>
      </p>
    </>
  );
};

export default SignUp;
