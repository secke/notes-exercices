package com.example.backend_spring.repository;

import com.example.backend_spring.entity.PublicLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PublicLinkRepository extends JpaRepository<PublicLink, Long> {
    Optional<PublicLink> findByUrlToken(String urlToken);
    Optional<PublicLink> findByNoteId(Long noteId);
}