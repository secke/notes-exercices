package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {
    
    List<Share> findByNoteId(Long noteId);
    
    @Query("SELECT s FROM Share s WHERE s.note.id = :noteId " +
           "AND s.sharedWithUser.email = :email")
    Optional<Share> findByNoteIdAndSharedWithEmail(
        @Param("noteId") Long noteId,
        @Param("email") String email
    );
    
    boolean existsByNoteIdAndSharedWithUserId(Long noteId, Long userId);
}