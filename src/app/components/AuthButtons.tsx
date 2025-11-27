"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const AuthButtons = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (data) {
    return (
      <div className="flex gap-4 items-center">
        Welcome {data?.user?.name}{" "}
        <Button onClick={() => authClient.signOut()}>Log out</Button>
      </div>
    );
  }

  return <div className="flex flex-wrap gap-4 lg:gap-8 prose">Logged out</div>;
};

export const LoginForm = () => {
  return (
    <div className="prose">
      <h2 className="mt-0">Login</h2>
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
    </div>
  );
};

export const SignUpForm = () => {
  return (
    <div className="prose">
      <h2 className="mt-0">Sign up</h2>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          const result = await authClient.signUp.email({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
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
    </div>
  );
};
