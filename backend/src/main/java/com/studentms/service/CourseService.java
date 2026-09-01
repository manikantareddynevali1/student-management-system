package com.studentms.service;

import com.studentms.dto.CourseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    CourseDto createCourse(CourseDto courseDto);
    CourseDto updateCourse(UUID id, CourseDto courseDto);
    void deleteCourse(UUID id);
    CourseDto getCourseById(UUID id);
    List<CourseDto> getAllCourses();
    Page<CourseDto> searchCourses(String keyword, Pageable pageable);
}
