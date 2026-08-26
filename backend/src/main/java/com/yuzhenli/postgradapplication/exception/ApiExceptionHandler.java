package com.yuzhenli.postgradapplication.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> {
                    String field =
                            formatFieldName(error.getField());

                    String detail =
                            error.getDefaultMessage();

                    return detail == null
                            ? field + " is invalid."
                            : field + " " + detail + ".";
                })
                .orElse("Invalid programme data.");

        return ResponseEntity
                .badRequest()
                .body(new ApiError(message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError(
                        "The programme could not be saved because "
                                + "it conflicts with existing data."
                ));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(
            ResponseStatusException exception
    ) {
        String message =
                exception.getReason() != null
                        ? exception.getReason()
                        : "The request could not be completed.";

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(new ApiError(message));
    }

    private String formatFieldName(String field) {
        if (field.matches("links\\[\\d+\\]\\.displayName")) {
            return formatLinkField(field, "display name");
        }

        if (field.matches("links\\[\\d+\\]\\.url")) {
            return formatLinkField(field, "URL");
        }

        return switch (field) {
            case "programmeShortName" ->
                    "Programme short name";

            case "qsRanking" ->
                    "QS ranking";

            case "usNewsRanking" ->
                    "US News ranking";

            case "theRanking" ->
                    "THE ranking";

            case "arwuRanking" ->
                    "ARWU ranking";

            case "referenceCount" ->
                    "Reference count";

            default ->
                    field;
        };
    }

    private String formatLinkField(
            String field,
            String name
    ) {
        int openingBracket =
                field.indexOf('[');

        int closingBracket =
                field.indexOf(']');

        int index = Integer.parseInt(
                field.substring(
                        openingBracket + 1,
                        closingBracket
                )
        );

        return "Link " + (index + 1) + " " + name;
    }
}
