import { ISODateString } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string | null;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            department?: string | null;
            token?: string | null;
        };
        expires?: ISODateString;

    }
}