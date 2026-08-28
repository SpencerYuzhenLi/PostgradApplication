package com.yuzhenli.postgradapplication;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Scanner;

public class RefereeTokenHashGenerator {

    public static void main(String[] args)
            throws Exception {

        Scanner scanner =
                new Scanner(System.in);

        System.out.print("Token: ");

        String token =
                scanner.nextLine();

        MessageDigest digest =
                MessageDigest.getInstance(
                        "SHA-256"
                );

        byte[] hash =
                digest.digest(
                        token.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        String tokenHash =
                HexFormat.of()
                        .formatHex(hash);

        System.out.println(
                "Hash: " + tokenHash
        );
    }
}