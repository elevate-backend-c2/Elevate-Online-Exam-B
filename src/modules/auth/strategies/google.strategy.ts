import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import type { ConfigType } from "@nestjs/config";
import { googleOauthConfig } from "../config/google-oauth.config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfig: ConfigType<typeof googleOauthConfig>,
    ) {
        super({
            clientID: googleConfig.clientID!,
            clientSecret: googleConfig.clientSecret!,
            callbackURL: googleConfig.callbackURL!,
            scope: ['email', 'profile']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback) {
        console.log({ profile });
    }
}