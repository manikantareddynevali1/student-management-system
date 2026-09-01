package com.studentms.repository;

import com.studentms.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByCourseCode(String courseCode);

    Page<Course> findByCourseCodeContainingIgnoreCaseOrCourseNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String courseCode, String courseName, String department, Pageable pageable);
}
