package com.studentms.repository;

import com.studentms.entity.AcademicHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AcademicHistoryRepository extends JpaRepository<AcademicHistory, UUID> {
    List<AcademicHistory> findByStudentId(UUID studentId);
    List<AcademicHistory> findByRollNumber(String rollNumber);
}
