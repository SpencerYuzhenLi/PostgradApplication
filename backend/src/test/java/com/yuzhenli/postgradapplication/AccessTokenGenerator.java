package com.yuzhenli.postgradapplication;

import java.security.SecureRandom;
import java.util.Base64;

public class AccessTokenGenerator {
    public static void main(String[] args) {
        SecureRandom secureRandom =
                new SecureRandom();

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token =
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(bytes);
        System.out.println(token);
    }
}
