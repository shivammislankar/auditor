package com.a11y.auditor.repository;

import com.a11y.auditor.model.AuditHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditHistory, Long> {
    // Spring will automatically give us save(), findAll(), delete(), etc.
    List<AuditHistory> findByUserUsername(String Username);
}