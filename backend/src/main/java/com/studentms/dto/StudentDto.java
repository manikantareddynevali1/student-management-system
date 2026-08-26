package com.studentms.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentDto {
    private UUID id;
    private String rollNumber;
    private String fullName;
    private String department;
    private String email;
    private String phone;
    private LocalDate dob;
    private String gender;
    private String address;
    private Integer semester;
    private Double cgpa;
    private String photoUrl;
}
