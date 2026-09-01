package com.studentms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "marks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Marks {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private UUID studentId;
    private String studentName;
    private String rollNumber;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private Integer semester;
    private Integer internal;
    private Integer assignment;
    private Integer midterm;
    private Integer finalExam;
    private Integer total;
    private String grade;
    private Double gradePoint;
}
