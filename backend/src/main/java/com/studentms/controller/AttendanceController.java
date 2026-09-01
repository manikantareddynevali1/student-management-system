package com.studentms.controller;

import com.studentms.dto.AttendanceDto;
import com.studentms.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FACULTY')")
    public ResponseEntity<AttendanceDto> createAttendance(@Valid @RequestBody AttendanceDto attendanceDto) {
        return ResponseEntity.ok(attendanceService.createAttendance(attendanceDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FACULTY')")
    public ResponseEntity<AttendanceDto> updateAttendance(@PathVariable UUID id, @Valid @RequestBody AttendanceDto attendanceDto) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendanceDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable UUID id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }
}
