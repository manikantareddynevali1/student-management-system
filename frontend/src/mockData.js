// Centralized Mock Store for Role-Based University Management Portal

export const initialMockFaculty = [
  { id: 'f1', facultyId: 'FAC001', name: 'Dr. Alan Turing', username: 'turing', email: 'turing@university.edu', phone: '555-0201', department: 'Computer Science', designation: 'Professor & HOD', coursesAssigned: 'CS101 - Data Structures', status: 'ACTIVE' },
  { id: 'f2', facultyId: 'FAC002', name: 'Prof. Edgar Codd', username: 'codd', email: 'codd@university.edu', phone: '555-0202', department: 'Computer Science', designation: 'Associate Professor', coursesAssigned: 'CS202 - DBMS', status: 'ACTIVE' },
  { id: 'f3', facultyId: 'FAC003', name: 'Dr. Claude Shannon', username: 'shannon', email: 'shannon@university.edu', phone: '555-0203', department: 'Electronics & Comm', designation: 'Professor', coursesAssigned: 'EC301 - Signal Processing', status: 'ACTIVE' },
  { id: 'f4', facultyId: 'FAC004', name: 'Dr. Andrew Ng', username: 'andrew', email: 'andrew@university.edu', phone: '555-0204', department: 'Data Science', designation: 'Professor', coursesAssigned: 'DS401 - Machine Learning', status: 'ACTIVE' },
  { id: 'f5', facultyId: 'FAC005', name: 'Dr. Grace Hopper', username: 'hopper', email: 'hopper@university.edu', phone: '555-0205', department: 'Information Technology', designation: 'Assistant Professor', coursesAssigned: 'IT205 - Web Systems', status: 'ACTIVE' }
]

export const initialMockMarks = [
  { id: 'm1', studentId: '1', studentName: 'Alex Rivera', rollNumber: 'CS2026', courseName: 'Data Structures & Algorithms', courseCode: 'CS101', semester: 4, internal: 24, assignment: 19, midterm: 27, final: 28, total: 98, grade: 'A+' },
  { id: 'm2', studentId: '2', studentName: 'Sophia Chen', rollNumber: 'CS2027', courseName: 'Data Structures & Algorithms', courseCode: 'CS101', semester: 3, internal: 22, assignment: 18, midterm: 25, final: 26, total: 91, grade: 'A' },
  { id: 'm3', studentId: '3', studentName: 'Marcus Vance', rollNumber: 'EC2025', courseName: 'Digital Signal Processing', courseCode: 'EC301', semester: 6, internal: 18, assignment: 14, midterm: 20, final: 22, total: 74, grade: 'B' },
  { id: 'm4', studentId: '4', studentName: 'Emily Watson', rollNumber: 'DS2026', courseName: 'Machine Learning & AI', courseCode: 'DS401', semester: 4, internal: 25, assignment: 20, midterm: 28, final: 26, total: 99, grade: 'A+' },
  { id: 'm5', studentId: '5', studentName: 'Liam O\'Connor', rollNumber: 'CS2028', courseName: 'Database Management Systems', courseCode: 'CS202', semester: 2, internal: 19, assignment: 15, midterm: 21, final: 23, total: 78, grade: 'B+' }
]

export const initialMockTimetable = [
  { id: 't1', day: 'Monday', time: '09:00 AM - 10:30 AM', courseCode: 'CS101', courseName: 'Data Structures & Algorithms', faculty: 'Dr. Alan Turing', room: 'Lab 301', department: 'Computer Science', semester: 4, section: 'Sec A' },
  { id: 't2', day: 'Monday', time: '11:00 AM - 12:30 PM', courseCode: 'CS202', courseName: 'Database Management Systems', faculty: 'Prof. Edgar Codd', room: 'Hall B', department: 'Computer Science', semester: 4, section: 'Sec B' },
  { id: 't3', day: 'Tuesday', time: '09:00 AM - 10:30 AM', courseCode: 'DS401', courseName: 'Machine Learning & AI', faculty: 'Dr. Andrew Ng', room: 'Lab 102', department: 'Data Science', semester: 4, section: 'Sec A' },
  { id: 't4', day: 'Wednesday', time: '02:00 PM - 03:30 PM', courseCode: 'EC301', courseName: 'Digital Signal Processing', faculty: 'Dr. Claude Shannon', room: 'Auditorium 1', department: 'Electronics & Comm', semester: 6, section: 'Sec A' },
  { id: 't5', day: 'Thursday', time: '10:00 AM - 11:30 AM', courseCode: 'CS101', courseName: 'Data Structures & Algorithms', faculty: 'Dr. Alan Turing', room: 'Lab 301', department: 'Computer Science', semester: 4, section: 'Sec A' },
  { id: 't6', day: 'Friday', time: '01:00 PM - 02:30 PM', courseCode: 'CS202', courseName: 'Database Systems Lab', faculty: 'Prof. Edgar Codd', room: 'Lab 204', department: 'Computer Science', semester: 4, section: 'Sec B' }
]

export const initialMockExaminations = [
  { id: 'ex1', courseCode: 'CS101', courseName: 'Data Structures & Algorithms', type: 'End Semester', date: '2026-09-15', time: '10:00 AM - 01:00 PM', room: 'Hall A', semester: 4, department: 'Computer Science' },
  { id: 'ex2', courseCode: 'CS202', courseName: 'Database Management Systems', type: 'End Semester', date: '2026-09-18', time: '02:00 PM - 05:00 PM', room: 'Hall B', semester: 4, department: 'Computer Science' },
  { id: 'ex3', courseCode: 'DS401', courseName: 'Machine Learning & AI', type: 'Midterm', date: '2026-09-10', time: '09:30 AM - 11:30 AM', room: 'Lab 102', semester: 4, department: 'Data Science' },
  { id: 'ex4', courseCode: 'EC301', courseName: 'Digital Signal Processing', type: 'End Semester', date: '2026-09-22', time: '10:00 AM - 01:00 PM', room: 'Auditorium 1', semester: 6, department: 'Electronics & Comm' }
]

export const initialMockAnnouncements = [
  { id: 'an1', title: 'Fall 2026 End Semester Exam Timetable Released', description: 'The official examination schedule for all undergraduate programs is now published.', category: 'Examination', targetAudience: 'All', priority: 'Urgent', date: '2026-09-01' },
  { id: 'an2', title: 'Faculty Research Grant Applications Open', description: 'Faculty members are invited to submit proposals for the 2026 Innovation Grant.', category: 'Academic', targetAudience: 'Faculty', priority: 'Important', date: '2026-08-28' },
  { id: 'an3', title: 'Attendance Shortage Warning Notice', description: 'Students with attendance below 75% must meet their respective department heads before Sept 5th.', category: 'Attendance', targetAudience: 'Students', priority: 'Urgent', date: '2026-08-25' },
  { id: 'an4', title: 'Campus Tech Symposium 2026 Registration', description: 'Register for the annual inter-college technology hackathon and guest lecture series.', category: 'Event', targetAudience: 'All', priority: 'Normal', date: '2026-08-20' }
]

export const initialMockNotifications = [
  { id: 'n1', title: 'Attendance Warning Alert', description: 'Student Marcus Vance (EC2025) has dropped below 75% attendance threshold.', date: '2026-09-01', read: false, type: 'warning' },
  { id: 'n2', title: 'Mid-Semester Examination Schedule', description: 'The mid-semester exam timetable for Semester 4 has been published.', date: '2026-08-30', read: false, type: 'info' },
  { id: 'n3', title: 'Assignment Deadline Submission', description: 'Machine Learning & AI Assignment #2 deadline is tomorrow at 11:59 PM.', date: '2026-08-29', read: true, type: 'info' },
  { id: 'n4', title: 'New Course Added to Catalog', description: 'Course CS305 - Cloud Computing Architecture is now open for enrollment.', date: '2026-08-27', read: true, type: 'success' }
]

export const initialMockUsers = [
  { id: 'u1', username: 'admin', name: 'Dr. Sarah Connor', role: 'ADMIN', email: 'admin@university.edu', status: 'ACTIVE', lastLogin: '2026-09-01 10:15 AM' },
  { id: 'u2', username: 'turing', name: 'Dr. Alan Turing', role: 'FACULTY', email: 'turing@university.edu', status: 'ACTIVE', lastLogin: '2026-09-01 09:30 AM' },
  { id: 'u3', username: 'alex', name: 'Alex Rivera', role: 'STUDENT', email: 'alex@university.edu', status: 'ACTIVE', lastLogin: '2026-08-31 04:20 PM' }
]

export const initialMockAcademicHistory = [
  { semester: 'Semester 1', year: '2024-2025', sgpa: 3.85, cgpa: 3.85, creditsEarned: 22, status: 'PASSED' },
  { semester: 'Semester 2', year: '2024-2025', sgpa: 3.92, cgpa: 3.88, creditsEarned: 22, status: 'PASSED' },
  { semester: 'Semester 3', year: '2025-2026', sgpa: 3.90, cgpa: 3.89, creditsEarned: 24, status: 'PASSED' },
  { semester: 'Semester 4', year: '2025-2026 (Current)', sgpa: 3.95, cgpa: 3.90, creditsEarned: 24, status: 'IN PROGRESS' }
]
