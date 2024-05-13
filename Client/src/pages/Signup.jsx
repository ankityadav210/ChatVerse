import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

const Signup = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form>
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
                <Input id="name" placeholder="Enter your name..." />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username..." />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password..."
                />
              </div>
              <div>
                <Label htmlFor="bio">Password</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter your bio..."
                  className="resize-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className={"flex justify-center"}>
            <Button type="submit" className={"flex justify-center"}>
              SignUp
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Signup;
