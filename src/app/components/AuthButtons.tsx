"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";

export const AuthButtons = () => {
  const { data, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  if (isPending) {
    return null;
  }

  if (data) {
    return (
      <div className="flex gap-4 items-center text-sm font-medium">
        <span className="text-stone-600 dark:text-stone-400">
          Welcome, {data?.user?.name}
        </span>
        <button
          onClick={() => authClient.signOut()}
          className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white px-4 py-2 rounded-full transition-colors font-semibold"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-4">
          <DialogTrigger asChild>
            <button
              onClick={() => {
                setActiveTab("login");
                setIsOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg shadow-primary/20"
            >
              Log In
            </button>
          </DialogTrigger>
          <button
            onClick={() => {
              setActiveTab("signup");
              setIsOpen(true);
            }}
            className="text-stone-600 dark:text-stone-400 hover:text-primary transition-colors font-semibold text-sm"
          >
            Sign Up
          </button>
        </div>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Access Your Lab</DialogTitle>
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const LoginForm = () => {
  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await authClient.signIn.email({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          callbackURL: "/starters",
        });

        if (result.error) {
          console.error(result.error);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input name="email" type="email" id="login-email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-password">Password</Label>
        <Input name="password" type="password" id="login-password" required />
      </div>
      <div>
        <Button type="submit">Log in</Button>
      </div>
    </form>
  );
};

export const SignUpForm = ({ callbackURL }: { callbackURL?: string }) => {
  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await authClient.signUp.email({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          callbackURL,
        });

        if (result.error) {
          console.error(result.error);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input name="name" type="text" id="signup-name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input name="email" type="email" id="signup-email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input name="password" type="password" id="signup-password" required />
      </div>
      <div>
        <Button type="submit">Sign up</Button>
      </div>
    </form>
  );
};
