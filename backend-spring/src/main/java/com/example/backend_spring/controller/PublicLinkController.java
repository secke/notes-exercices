package com.example.backend_spring.controller;

import com.example.backend_spring.dto.link.*;
import com.example.backend_spring.dto.note.NoteResponse;
import com.example.backend_spring.service.PublicLinkService;
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
@RequiredArgsConstructor
@Tag(name = "Public Links", description = "Public link management")
public class PublicLinkController {

    private final PublicLinkService publicLinkService;

    @PostMapping("/api/v1/notes/{noteId}/share/public")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Generate public link for note")
    public ResponseEntity<PublicLinkDto> createPublicLink(
            @PathVariable Long noteId,
            @Valid @RequestBody(required = false) CreatePublicLinkRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        CreatePublicLinkRequest linkRequest = request != null ?
                request : new CreatePublicLinkRequest();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(publicLinkService.createPublicLink(
                        noteId, linkRequest, userDetails.getUsername()));
    }

    @DeleteMapping("/api/v1/public-links/{linkId}")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Revoke public link")
    public ResponseEntity<Void> deletePublicLink(
            @PathVariable Long linkId,
            @AuthenticationPrincipal UserDetails userDetails) {

        publicLinkService.deletePublicLink(linkId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/p/{urlToken}")
    @Operation(summary = "Access public note via URL token")
    public ResponseEntity<NoteResponse> getPublicNote(@PathVariable String urlToken) {
        return ResponseEntity.ok(publicLinkService.getNoteByToken(urlToken));
    }
}
