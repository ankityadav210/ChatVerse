import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useInputValidation } from "6pp";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";

const Login = () => {
  const username = useInputValidation("");
  const password = useInputValidation("");

  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/users/login`,
        {
          userName: username.value,
          password: password.value,
        },

        config
      );
      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const redirectButton = () => {
    navigate("/signup");
  };
  const handleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-indigo-600">
      <form onSubmit={handleLogin}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className={"flex justify-center"}>CHAT-VERSE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type={"text"}
                  placeholder="Enter your username..."
                  value={username.value}
                  onChange={username.changeHandler}
                />
              </div>
              <div className="relative flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  placeholder="Enter your password..."
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <div className=" absolute top-6 right-4 cursor-pointer">
                  {hidePassword ? (
                    <EyeOff onClick={handleHidePassword} />
                  ) : (
                    <Eye onClick={handleHidePassword} />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className={"flex justify-center"}>
            {!username.value || !password.value ? (
              <Button
                disabled
                type="submit"
                className={"flex justify-center w-32"}
              >
                Login
              </Button>
            ) : (
              <Button type="submit" className={"flex justify-center w-32"}>
                Login
              </Button>
            )}
          </CardFooter>
          <CardFooter className={"flex justify-center"}>
            <Button
              variant="outline"
              onClick={redirectButton}
              className={"flex justify-center"}
            >
              Sign Up Instead
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Login;
