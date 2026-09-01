package com.studentms.controller;

import com.studentms.dto.CourseDto;
import com.studentms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FACULTY')")
    public ResponseEntity<CourseDto> createCourse(@Valid @RequestBody CourseDto courseDto) {
        return ResponseEntity.ok(courseService.createCourse(courseDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FACULTY')")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable UUID id, @Valid @RequestBody CourseDto courseDto) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping
    public ResponseEntity<Page<CourseDto>> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "courseName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(courseService.searchCourses(keyword, pageable));
    }
}
