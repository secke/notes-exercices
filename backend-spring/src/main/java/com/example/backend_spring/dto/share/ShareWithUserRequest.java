package com.example.backend_spring.dto.share;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class ShareWithUserRequest {
    @Email
    @NotBlank(message = "Email est requis")
    private String email;
}