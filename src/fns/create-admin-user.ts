import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdminSession } from "@/fns/require-admin";

export const createAdminUser = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string; email: string; password: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminSession(data.accessToken);

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not set on the server. Add it in Vercel → Settings → Environment Variables, then redeploy.",
      );
    }

    const email = data.email.trim().toLowerCase();
    if (!email || !data.password) {
      throw new Error("Email and password are required.");
    }
    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
    });

    if (createError) {
      throw new Error(createError.message);
    }

    if (!created.user?.id) {
      throw new Error("User was created but no user id was returned.");
    }

    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: created.user.id,
      role: "admin",
    });

    if (roleError) {
      throw new Error(`User created but admin role failed: ${roleError.message}`);
    }

    return {
      userId: created.user.id,
      email: created.user.email ?? email,
    };
  });
