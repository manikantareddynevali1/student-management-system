package com.studentms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class AttendanceDto {
    private UUID id;

    @NotNull(message = "Student ID is required")
    private UUID studentId;
    private String studentName;
    private String studentRollNumber;

    private UUID courseId;
    private String courseName;
    private String courseCode;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Status is required")
    private String status; // PRESENT, ABSENT, LATE

    private String remarks;
}
