package com.example.backend_spring.service;

import com.example.backend_spring.dto.note.CreateNoteRequest;
import com.example.backend_spring.dto.note.NoteResponse;
import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.Tag;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.exception.ResourceNotFoundException;
import com.example.backend_spring.repository.NoteRepository;
import com.example.backend_spring.repository.ShareRepository;
import com.example.backend_spring.repository.TagRepository;
import com.example.backend_spring.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private ShareRepository shareRepository;

    @InjectMocks
    private NoteService noteService;

    private User testUser;
    private Note testNote;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .passwordHash("hashedpassword")
                .build();

        testNote = Note.builder()
                .id(1L)
                .title("Test Note")
                .contentMd("Test content")
                .owner(testUser)
                .visibility(Note.Visibility.PRIVATE)
                .tags(new HashSet<>())
                .build();
    }

    @Test
    void createNote_Success() {
        // Arrange
        CreateNoteRequest request = new CreateNoteRequest();
        request.setTitle("New Note");
        request.setContentMd("Content");
        request.setTags(Set.of("test"));

        Tag testTag = Tag.builder()
                .id(1L)
                .label("test")
                .notes(new HashSet<>())
                .build();

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(tagRepository.findByLabel(anyString()))
                .thenReturn(Optional.empty());
        when(tagRepository.save(any(Tag.class)))
                .thenReturn(testTag);
        when(noteRepository.save(any(Note.class))).thenReturn(testNote);

        // Act
        NoteResponse response = noteService.createNote(request, "test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals("Test Note", response.getTitle());
        verify(noteRepository, times(1)).save(any(Note.class));
    }

    @Test
    void getNoteById_NotFound_ThrowsException() {
        // Arrange
        when(noteRepository.findById(999L)).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.getNoteById(999L, "test@example.com"));
    }

    @Test
    void deleteNote_Success() {
        // Arrange
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(noteRepository.findById(1L)).thenReturn(Optional.of(testNote));

        // Act
        noteService.deleteNote(1L, "test@example.com");

        // Assert
        verify(noteRepository, times(1)).delete(testNote);
    }
}
