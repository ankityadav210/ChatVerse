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

import * as React from "react";

const Login = () => {
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
      <form>
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
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={"password"}
                  placeholder="Enter your password..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className={"flex justify-center"}>
            <Button type="submit" className={"flex justify-center"}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Login;
