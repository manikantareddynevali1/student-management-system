package com.studentms.service.impl;

import com.studentms.dto.CourseDto;
import com.studentms.entity.Course;
import com.studentms.exception.ResourceNotFoundException;
import com.studentms.repository.CourseRepository;
import com.studentms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseDto createCourse(CourseDto dto) {
        Course course = Course.builder()
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .department(dto.getDepartment())
                .credits(dto.getCredits())
                .instructor(dto.getInstructor())
                .description(dto.getDescription())
                .build();
        return mapToDto(courseRepository.save(course));
    }

    @Override
    @Transactional
    public CourseDto updateCourse(UUID id, CourseDto dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.setCourseCode(dto.getCourseCode());
        course.setCourseName(dto.getCourseName());
        course.setDepartment(dto.getDepartment());
        course.setCredits(dto.getCredits());
        course.setInstructor(dto.getInstructor());
        course.setDescription(dto.getDescription());
        return mapToDto(courseRepository.save(course));
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseById(UUID id) {
        return courseRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDto> searchCourses(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return courseRepository.findAll(pageable).map(this::mapToDto);
        }
        return courseRepository.findByCourseCodeContainingIgnoreCaseOrCourseNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                keyword, keyword, keyword, pageable).map(this::mapToDto);
    }

    private CourseDto mapToDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseName(course.getCourseName());
        dto.setDepartment(course.getDepartment());
        dto.setCredits(course.getCredits());
        dto.setInstructor(course.getInstructor());
        dto.setDescription(course.getDescription());
        return dto;
    }
}
