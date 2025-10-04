package com.example.backend_spring.dto.note;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.example.backend_spring.dto.link.PublicLinkDto;
import com.example.backend_spring.dto.share.ShareDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String contentMd;
    private String visibility;
    private Set<String> tags;
    private Long ownerId;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ShareDto> shares;
    private PublicLinkDto publicLink;
}
