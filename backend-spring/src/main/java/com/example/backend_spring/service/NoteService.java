package com.example.backend_spring.service;

import com.example.backend_spring.dto.note.*;
import com.example.backend_spring.entity.*;
import com.example.backend_spring.exception.*;
import com.example.backend_spring.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {
    
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ShareRepository shareRepository;
    
    @Transactional(readOnly = true)
    public Page<NoteListResponse> searchNotes(
            String userEmail,
            String query,
            String tag,
            String visibility,
            int page,
            int size) {

        log.debug("searchNotes called with userEmail={}, query={}, tag={}, visibility={}, page={}, size={}",
                  userEmail, query, tag, visibility, page, size);

        User user = getUserByEmail(userEmail);
        log.debug("Found user with id={}", user.getId());

        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

        Note.Visibility visibilityEnum = visibility != null ?
                Note.Visibility.valueOf(visibility.toUpperCase()) : null;

        log.debug("Calling repository with userId={}, query={}, tag={}, visibility={}",
                  user.getId(), query, tag, visibilityEnum);

        Page<Note> notes = noteRepository.searchNotes(
                user.getId(),
                query,
                tag,
                visibilityEnum,
                pageable
        );

        log.debug("Found {} notes", notes.getTotalElements());

        return notes.map(this::toListResponse);
    }
    
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long noteId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        
        validateAccess(note, user);
        
        return toDetailResponse(note);
    }
    
    @Transactional
    public NoteResponse createNote(CreateNoteRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        
        Note note = Note.builder()
                .title(request.getTitle())
                .contentMd(request.getContentMd())
                .owner(user)
                .visibility(Note.Visibility.PRIVATE)
                .build();
        
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = request.getTags().stream()
                    .map(this::getOrCreateTag)
                    .collect(Collectors.toSet());
            note.setTags(tags);
        }
        
        note = noteRepository.save(note);
        return toDetailResponse(note);
    }
    
    @Transactional
    public NoteResponse updateNote(Long noteId, UpdateNoteRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        
        if (!note.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("You don't have permission to update this note");
        }
        
        if (request.getTitle() != null) {
            note.setTitle(request.getTitle());
        }
        
        if (request.getContentMd() != null) {
            note.setContentMd(request.getContentMd());
        }
        
        if (request.getVisibility() != null) {
            note.setVisibility(Note.Visibility.valueOf(request.getVisibility().toUpperCase()));
        }
        
        if (request.getTags() != null) {
            Set<Tag> tags = request.getTags().stream()
                    .map(this::getOrCreateTag)
                    .collect(Collectors.toSet());
            note.getTags().clear();
            note.getTags().addAll(tags);
        }
        
        note = noteRepository.save(note);
        return toDetailResponse(note);
    }
    
    @Transactional
    public void deleteNote(Long noteId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        
        if (!note.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("You don't have permission to delete this note");
        }
        
        noteRepository.delete(note);
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    private Tag getOrCreateTag(String label) {
        return tagRepository.findByLabel(label)
                .orElseGet(() -> tagRepository.save(Tag.builder().label(label).build()));
    }
    
    private void validateAccess(Note note, User user) {
        boolean isOwner = note.getOwner().getId().equals(user.getId());
        boolean isShared = shareRepository.existsByNoteIdAndSharedWithUserId(
                note.getId(), user.getId());
        
        if (!isOwner && !isShared && note.getVisibility() != Note.Visibility.PUBLIC) {
            throw new ForbiddenException("You don't have access to this note");
        }
    }
    
    private NoteListResponse toListResponse(Note note) {
        return NoteListResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .visibility(note.getVisibility().name())
                .tags(note.getTags().stream()
                        .map(Tag::getLabel)
                        .collect(Collectors.toSet()))
                .ownerEmail(note.getOwner().getEmail())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
    
    private NoteResponse toDetailResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .contentMd(note.getContentMd())
                .visibility(note.getVisibility().name())
                .tags(note.getTags().stream()
                        .map(Tag::getLabel)
                        .collect(Collectors.toSet()))
                .ownerId(note.getOwner().getId())
                .ownerEmail(note.getOwner().getEmail())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}