package com.studentms.service;

import com.studentms.dto.AttendanceDto;

import java.util.List;
import java.util.UUID;

public interface AttendanceService {
    AttendanceDto createAttendance(AttendanceDto dto);
    AttendanceDto updateAttendance(UUID id, AttendanceDto dto);
    void deleteAttendance(UUID id);
    List<AttendanceDto> getAllAttendance();
    List<AttendanceDto> getAttendanceByStudent(UUID studentId);
}
