package com.example.backend_spring.controller;

import com.example.backend_spring.dto.note.*;
import com.example.backend_spring.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Notes", description = "Notes management endpoints")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @Operation(summary = "Search and filter notes with pagination")
    public ResponseEntity<Page<NoteListResponse>> searchNotes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String visibility,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Page<NoteListResponse> notes = noteService.searchNotes(
                userDetails.getUsername(), query, tag, visibility, page, size);

        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get note by ID")
    public ResponseEntity<NoteResponse> getNoteById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(noteService.getNoteById(id, userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Create a new note")
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noteService.createNote(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing note")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(noteService.updateNote(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a note")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        noteService.deleteNote(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
