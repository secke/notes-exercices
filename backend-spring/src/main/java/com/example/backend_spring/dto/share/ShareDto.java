package com.example.backend_spring.dto.share;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareDto {
    private Long id;
    private Long noteId;
    private String sharedWithEmail;
    private String permission;
}