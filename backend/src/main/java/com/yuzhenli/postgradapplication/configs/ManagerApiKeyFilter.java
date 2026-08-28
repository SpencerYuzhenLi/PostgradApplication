package com.yuzhenli.postgradapplication.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Component
public class ManagerApiKeyFilter
        extends OncePerRequestFilter {

    private static final String HEADER_NAME =
            "X-Manager-Key";

    private final String managerApiKey;

    public ManagerApiKeyFilter(
            @Value("${manager.api-key}")
            String managerApiKey
    ) {
        if (managerApiKey.isBlank()) {
            throw new IllegalStateException(
                    "Manager API key is not configured."
            );
        }

        this.managerApiKey =
                managerApiKey;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        if (
                "OPTIONS".equalsIgnoreCase(
                        request.getMethod()
                )
        ) {
            return true;
        }

        String path =
                request.getRequestURI();

        return !(
                path.startsWith(
                        "/api/programmes"
                ) ||
                        path.startsWith(
                                "/api/referees"
                        )
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String suppliedKey =
                request.getHeader(
                        HEADER_NAME
                );

        if (
                suppliedKey == null ||
                        !keysMatch(
                                suppliedKey,
                                managerApiKey
                        )
        ) {
            response.sendError(
                    HttpServletResponse
                            .SC_UNAUTHORIZED,
                    "Invalid manager API key"
            );

            return;
        }

        filterChain.doFilter(
                request,
                response
        );
    }

    private boolean keysMatch(
            String suppliedKey,
            String expectedKey
    ) {
        return MessageDigest.isEqual(
                suppliedKey.getBytes(
                        StandardCharsets.UTF_8
                ),
                expectedKey.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }
}