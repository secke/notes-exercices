package com.example.backend_spring.dto.note;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class NoteListResponse {
    private Long id;
    private String title;
    private String visibility;
    private Set<String> tags;
    private String ownerEmail;
    private LocalDateTime updatedAt;
}