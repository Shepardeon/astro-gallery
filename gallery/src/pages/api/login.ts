import type { APIContext } from "astro";
import { PocketBaseCollections } from "../../models/PocketBase";

export async function POST(context: APIContext) {
  try {
    const data = await context.request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    await context.locals.pb
      .collection(PocketBaseCollections.USERS)
      .authWithPassword(email ?? "", password ?? "");

    return new Response(
      JSON.stringify({
        message: "Ok",
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message:
          (error as { response: { message: string } })?.response?.message ??
          "Unknown error",
      }),
      {
        status: 400,
      },
    );
  }
}
