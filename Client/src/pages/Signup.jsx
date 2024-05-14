import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbEyeFilled } from "react-icons/tb";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "@/helpers/validators";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const name = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const bio = useInputValidation("");
  const password = useStrongPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const redirectButton = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-[350px]">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <CardHeader>
                <div className="flex justify-center items-center">
                  <Avatar className="size-48">
                    <input
                      style={{ display: "none" }}
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <AvatarImage
                      src={selectedImage || "https://github.com/shadcn.png"}
                      alt={"Upload Avatar"}
                      onClick={handleImageClick}
                      style={{ cursor: "pointer" }}
                    />

                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name..."
                  value={name.value}
                  onChange={name.changeHandler}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username..."
                  value={username.value}
                  onChange={username.changeHandler}
                />
              </div>
              {username.error && username.value && (
                <div className="text-red-500 text-sm">{username.error}</div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password..."
                  value={password.value}
                  onChange={password.changeHandler}
                />
              </div>
              {password.error && password.value && (
                <div className="text-red-500 text-sm">{password.error}</div>
              )}

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter your bio..."
                  className="resize-none"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className={"flex justify-center"}>
            {!password.value ||
            !username.value ||
            !name.value ||
            !bio.value ||
            password.error ||
            username.error ? (
              <Button
                disabled
                type="submit"
                className={"flex justify-center w-40"}
              >
                SignUp
              </Button>
            ) : (
              <Button type="submit" className={"flex justify-center"}>
                SignUp
              </Button>
            )}
          </CardFooter>
          <CardFooter className={"flex justify-center"}>
            <Button
              variant={"outline"}
              onClick={redirectButton}
              className={"flex justify-center"}
            >
              If Already SignedUp
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Signup;
