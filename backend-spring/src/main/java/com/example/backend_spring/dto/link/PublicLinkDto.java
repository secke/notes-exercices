package com.example.backend_spring.dto.link;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicLinkDto {
    private Long id;
    private String urlToken;
    private String fullUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}