package com.example.backend_spring.dto.link;

import lombok.*;
import java.time.LocalDateTime;

@Data
public class CreatePublicLinkRequest {
    private LocalDateTime expiresAt; // Optional
}