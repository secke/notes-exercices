package com.example.backend_spring.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class CreateNoteRequest {
    @NotBlank(message = "Title est requis")
    @Size(min = 3, max = 255, message = "Title doit etre entre 3 et 255 caracteres")
    private String title;

    @Size(max = 50000, message = "Content doit pas depasser 50000 caracteres")
    private String contentMd;
    
    private Set<String> tags;
}