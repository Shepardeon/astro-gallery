import type { APIContext } from "astro";
import { loginAsync } from "../../services/server/UserService";

export async function POST(context: APIContext) {
  try {
    const data = await context.request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    const result = await loginAsync(email ?? "", password ?? "");

    return new Response(
      JSON.stringify({
        token: result.token,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          (error as { response: { message: string } })?.response?.message ??
          "Unknown error",
      }),
      {
        status: 400,
      },
    );
  }
}
