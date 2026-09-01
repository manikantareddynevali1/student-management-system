package com.studentms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CourseDto {
    private UUID id;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String courseName;

    private String department;
    private Integer credits;
    private String instructor;
    private String description;
}
