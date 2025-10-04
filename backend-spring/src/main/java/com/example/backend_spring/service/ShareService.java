package com.example.backend_spring.service;

import com.example.backend_spring.dto.share.*;
import com.example.backend_spring.entity.*;
import com.example.backend_spring.exception.*;
import com.example.backend_spring.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShareService {
    
    private final ShareRepository shareRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ShareDto shareWithUser(Long noteId, ShareWithUserRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        
        if (!note.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("You don't have permission to share this note");
        }
        
        User sharedWithUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User to share with not found"));
        
        if (shareRepository.existsByNoteIdAndSharedWithUserId(noteId, sharedWithUser.getId())) {
            throw new BadRequestException("Note already shared with this user");
        }
        
        Share share = Share.builder()
                .note(note)
                .sharedWithUser(sharedWithUser)
                .permission(Share.Permission.READ)
                .build();
        
        share = shareRepository.save(share);
        
        note.setVisibility(Note.Visibility.SHARED);
        noteRepository.save(note);
        
        return ShareDto.builder()
                .id(share.getId())
                .noteId(note.getId())
                .sharedWithEmail(sharedWithUser.getEmail())
                .permission(share.getPermission().name())
                .build();
    }
    
    @Transactional
    public void deleteShare(Long shareId, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new ResourceNotFoundException("Share not found"));
        
        if (!share.getNote().getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("You don't have permission to delete this share");
        }
        
        shareRepository.delete(share);
    }
}
