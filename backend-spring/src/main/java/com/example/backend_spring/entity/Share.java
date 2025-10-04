package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shares")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"note", "sharedWithUser"})
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id", nullable = false)
    private User sharedWithUser;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permission permission = Permission.READ;
    
    public enum Permission {
        READ
    }
}
