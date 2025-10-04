package com.example.backend_spring.controller;

import com.example.backend_spring.dto.share.*;
import com.example.backend_spring.service.ShareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Sharing", description = "Note sharing endpoints")
public class ShareController {

    private final ShareService shareService;

    @PostMapping("/{noteId}/share/user")
    @Operation(summary = "Share note with another user")
    public ResponseEntity<ShareDto> shareWithUser(
            @PathVariable Long noteId,
            @Valid @RequestBody ShareWithUserRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shareService.shareWithUser(noteId, request, userDetails.getUsername()));
    }

    @DeleteMapping("/shares/{shareId}")
    @Operation(summary = "Remove user access to note")
    public ResponseEntity<Void> deleteShare(
            @PathVariable Long shareId,
            @AuthenticationPrincipal UserDetails userDetails) {

        shareService.deleteShare(shareId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
