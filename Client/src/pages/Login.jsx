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
import { Eye, EyeOff } from "lucide-react";

import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const redirectButton = () => {
    navigate("/signup");
  };
  const handleHidePassword = () => {
    setHidePassword(!hidePassword);
  };
  // const [isLoading, setIsLoading] = useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const toastId = toast.loading("Logging In...");
  //   setIsLoading(true);

  //   const config = {
  //     withCredentials: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   try {
  //     const { data } = await axios.post(
  //       `${server}/api/v1/user/login`,
  //       {
  //         username: username.value,
  //         password: password.value,
  //       },
  //       config
  //     );
  //     dispatch(userExists(data.user));
  //     toast.success(data.message, {
  //       id: toastId,
  //     });
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Something Went Wrong", {
  //       id: toastId,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit}>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            {!username || !password ? (
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
