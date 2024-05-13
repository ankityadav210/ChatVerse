import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState } from "react";

const LoginOrSignup = () => {
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
    <div className="flex h-screen justify-center items-center">
      <form>
        <Tabs defaultValue={"login"} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>CHAT-VERSE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" defaultValue="" />
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button type="submit" className="w-60">
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
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

                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    className={"resize-none"}
                    id="bio"
                    placeholder="Type your bio here."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button type="submit" className="w-60 ">
                  SignUp
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default LoginOrSignup;
