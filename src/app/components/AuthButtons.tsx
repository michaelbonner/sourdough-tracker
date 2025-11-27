"use client";

import { authClient } from "@/lib/auth-client";

export const AuthButtons = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (data) {
    return (
      <div>
        Welcome {data?.user?.name}{" "}
        <button onClick={() => authClient.signOut()}>Log out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 prose">
      <div>
        <h2>Login</h2>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const result = await authClient.signIn.email({
              email: formData.get("email") as string,
              password: formData.get("password") as string,
            });

            if (result.error) {
              console.error(result.error);
            }
          }}
        >
          <div>
            <label htmlFor="email">Email</label>
            <input name="email" type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" id="password" required />
          </div>
          <div>
            <button type="submit">Log in</button>
          </div>
        </form>
      </div>
      <div>
        <h2>Sign up</h2>
        <form
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
          <div>
            <label htmlFor="name">Name</label>
            <input name="name" type="text" id="name" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input name="email" type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" id="password" required />
          </div>
          <div>
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
};
