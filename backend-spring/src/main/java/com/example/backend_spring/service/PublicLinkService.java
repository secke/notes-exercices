package com.example.backend_spring.service;

import com.example.backend_spring.dto.link.*;
import com.example.backend_spring.dto.note.NoteResponse;
import com.example.backend_spring.entity.*;
import com.example.backend_spring.exception.*;
import com.example.backend_spring.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicLinkService {
    
    private final PublicLinkRepository publicLinkRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public PublicLinkDto createPublicLink(
            Long noteId, 
            CreatePublicLinkRequest request, 
            String ownerEmail) {
        
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        
        if (!note.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("Vous n'avez pas la permission de créer un lien public");
        }
        
        PublicLink publicLink = PublicLink.builder()
                .note(note)
                .expiresAt(request.getExpiresAt())
                .build();
        
        publicLink = publicLinkRepository.save(publicLink);
        
        note.setVisibility(Note.Visibility.PUBLIC);
        noteRepository.save(note);
        
        return toDto(publicLink);
    }
    
    @Transactional(readOnly = true)
    public NoteResponse getNoteByToken(String token) {
        PublicLink publicLink = publicLinkRepository.findByUrlToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lien public non trouvé"));
        
        if (publicLink.isExpired()) {
            throw new BadRequestException("Le lien public a expiré");
        }
        
        Note note = publicLink.getNote();
        
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .contentMd(note.getContentMd())
                .visibility(note.getVisibility().name())
                .tags(note.getTags().stream()
                        .map(Tag::getLabel)
                        .collect(Collectors.toSet()))
                .ownerEmail(note.getOwner().getEmail())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
    
    @Transactional
    public void deletePublicLink(Long linkId, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        PublicLink publicLink = publicLinkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Lien public non trouvé"));

        if (!publicLink.getNote().getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("Vous n'avez pas la permission de supprimer ce lien");
        }
        
        publicLinkRepository.delete(publicLink);
    }
    
    private PublicLinkDto toDto(PublicLink link) {
        return PublicLinkDto.builder()
                .id(link.getId())
                .urlToken(link.getUrlToken())
                .fullUrl("/p/" + link.getUrlToken())
                .createdAt(link.getCreatedAt())
                .expiresAt(link.getExpiresAt())
                .build();
    }
}