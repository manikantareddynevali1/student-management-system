package com.studentms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "academic_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicHistory {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private UUID studentId;
    private String rollNumber;
    private String semester;
    private String year;
    private Double sgpa;
    private Double cgpa;
    private Integer creditsEarned;
    private String status;
}
