package com.example.backend_spring.dto.note;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class UpdateNoteRequest {
    @Size(min = 3, max = 255)
    private String title;
    
    @Size(max = 50000)
    private String contentMd;
    
    private Set<String> tags;
    
    private String visibility; // PRIVATE, SHARED, PUBLIC
}