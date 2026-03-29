import type PocketBase from "pocketbase";

interface ImportMetaEnv {
  readonly POKETBASE_URL: string;
  readonly PUBLIC_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
    }
  }
}
