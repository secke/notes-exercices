package com.example.backend_spring.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email(message = "Email doit etre valid")
    @NotBlank(message = "Email est requis")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}
