// // import XLSX from 'xlsx';
// // import User from '../models/User.js';

// // export class ExcelService {
// //   static async processStudentExcel(fileBuffer, session, semester) {
// //     const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
// //     const sheetName = workbook.SheetNames[0];
// //     const worksheet = workbook.Sheets[sheetName];
// //     const data = XLSX.utils.sheet_to_json(worksheet);

// //     const results = {
// //       success: 0,
// //       errors: [],
// //       duplicates: 0
// //     };

// //     for (const row of data) {
// //       try {
// //         // Validate required fields
// //         if (!row.Student_ID || !row.Name || !row.Email || !row.Mobile) {
// //           results.errors.push(`Missing required fields for ${row.Name || 'Unknown'}`);
// //           continue;
// //         }

// //         // Check if user already exists
// //         const existingUser = await User.findOne({
// //           $or: [
// //             { userId: row.Student_ID },
// //             { email: row.Email.toLowerCase() }
// //           ]
// //         });

// //         if (existingUser) {
// //           results.duplicates++;
// //           continue;
// //         }

// //         // Create new student user
// //         const newUser = {
// //           userId: row.Student_ID,
// //           name: row.Name.trim(),
// //           email: row.Email.toLowerCase().trim(),
// //           mobile: row.Mobile.toString(),
// //           role: 'student',
// //           department: row.Dept,
// //           specialization: row.Spec,
// //           session,
// //           semester,
// //           admissionType: row.Admission_Type,
// //           category: row.Category,
// //           password: 'student123', // Default password
// //           isActive: true
// //         };

// //         await User.create(newUser);
// //         results.success++;

// //       } catch (error) {
// //         results.errors.push(`Error processing ${row.Name}: ${error.message}`);
// //       }
// //     }

// //     return results;
// //   }

// //   static async processFacultyExcel(fileBuffer, session, semester) {
// //     const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
// //     const sheetName = workbook.SheetNames[0];
// //     const worksheet = workbook.Sheets[sheetName];
// //     const data = XLSX.utils.sheet_to_json(worksheet);

// //     const results = {
// //       success: 0,
// //       errors: [],
// //       duplicates: 0
// //     };

// //     for (const row of data) {
// //       try {
// //         // Validate required fields
// //         if (!row.Staff_ID || !row.Name || !row.Email || !row.Mobile) {
// //           results.errors.push(`Missing required fields for ${row.Name || 'Unknown'}`);
// //           continue;
// //         }

// //         // Check if user already exists
// //         const existingUser = await User.findOne({
// //           $or: [
// //             { staffId: row.Staff_ID },
// //             { email: row.Email.toLowerCase() }
// //           ]
// //         });

// //         if (existingUser) {
// //           results.duplicates++;
// //           continue;
// //         }

// //         // Create new faculty user
// //         const newUser = {
// //           userId: row.Staff_ID,
// //           name: row.Name.trim(),
// //           email: row.Email.toLowerCase().trim(),
// //           mobile: row.Mobile.toString(),
// //           role: 'professor',
// //           department: row.Department,
// //           staffId: row.Staff_ID,
// //           session,
// //           semester,
// //           password: 'prof123', // Default password
// //           isActive: true
// //         };

// //         await User.create(newUser);
// //         results.success++;

// //       } catch (error) {
// //         results.errors.push(`Error processing ${row.Name}: ${error.message}`);
// //       }
// //     }

// //     return results;
// //   }
// // }
// import XLSX from 'xlsx';
// import User from '../models/User.js';

// export class ExcelService {
//   static async processStudentExcel(fileBuffer, session, semester) {
//     try {
//       const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
      
//       // Convert to JSON with proper options
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
//         header: 1,
//         defval: '',
//         raw: false 
//       });

//       console.log('📊 Raw Excel Data (first 5 rows):', jsonData.slice(0, 5));

//       const results = {
//         success: 0,
//         errors: [],
//         duplicates: 0
//       };

//       if (!jsonData || jsonData.length < 2) {
//         results.errors.push('Excel file is empty or has insufficient data');
//         return results;
//       }

//       // Find the actual data start row - look for row with "SL NO" or similar
//       let dataStartIndex = -1;
//       let headers = [];

//       for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
//         const row = jsonData[i];
//         if (row && Array.isArray(row)) {
//           // Look for the header row containing column names
//           const headerIndex = row.findIndex(cell => 
//             cell && typeof cell === 'string' && 
//             (cell.includes('SL NO') || cell.includes('Student ID'))
//           );
          
//           if (headerIndex !== -1) {
//             dataStartIndex = i;
//             headers = row;
//             break;
//           }
//         }
//       }

//       if (dataStartIndex === -1) {
//         results.errors.push('Could not find header row with column names');
//         return results;
//       }

//       console.log('📋 Headers found at row', dataStartIndex + 1, ':', headers);

//       // Find column indices
//       const slNoIndex = headers.findIndex(h => h && h.toString().includes('SL NO'));
//       const studentIdIndex = headers.findIndex(h => h && h.toString().includes('Student ID'));
//       const nameIndex = headers.findIndex(h => h && h.toString().includes('Name'));
//       const emailIndex = headers.findIndex(h => h && (h.toString().includes('Email') || h.toString().includes('E-mail')));
//       const mobileIndex = headers.findIndex(h => h && h.toString().includes('Mobile'));
//       const specIndex = headers.findIndex(h => h && h.toString().includes('Spec'));
//       const admissionTypeIndex = headers.findIndex(h => h && h.toString().includes('Admission Type'));
//       const categoryIndex = headers.findIndex(h => h && h.toString().includes('Category'));
//       const deptIndex = headers.findIndex(h => h && h.toString().includes('Dept'));

//       console.log('📋 Column indices:', {
//         slNo: slNoIndex,
//         studentId: studentIdIndex,
//         name: nameIndex,
//         email: emailIndex,
//         mobile: mobileIndex,
//         spec: specIndex,
//         admission: admissionTypeIndex,
//         category: categoryIndex,
//         dept: deptIndex
//       });

//       // Process data rows
//       for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
//         const row = jsonData[i];
        
//         if (!row || !Array.isArray(row) || row.length === 0) continue;

//         try {
//           // Extract data using column indices
//           const slNo = row[slNoIndex];
//           const studentId = row[studentIdIndex];
//           const name = row[nameIndex];
//           let email = row[emailIndex];
//           const mobile = row[mobileIndex];
//           const spec = row[specIndex];
//           const admissionType = row[admissionTypeIndex];
//           const category = row[categoryIndex];
//           const dept = row[deptIndex];

//           console.log(`Processing row ${i + 1}:`, {
//             slNo, studentId, name, email, mobile
//           });

//           // Skip if essential data missing
//           if (!slNo || !studentId || !name || slNo === 'SL NO') {
//             console.log(`Skipping row ${i + 1}: Missing essential data`);
//             continue;
//           }

//           // Generate email if missing
//           if (!email || email === '' || email.toString().trim() === '') {
//             const cleanStudentId = studentId.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
//             email = `${cleanStudentId}@nsut.ac.in`;
//             console.log(`Generated email for ${name}: ${email}`);
//           }

//           // Clean data
//           const cleanEmail = email.toString().toLowerCase().trim();
//           const cleanMobile = mobile ? mobile.toString().replace(/[^\d]/g, '') : '9999999999';
//           const finalMobile = cleanMobile.length >= 10 ? cleanMobile.substring(0, 10) : '9999999999';

//           // Check for duplicates
//           const existingUser = await User.findOne({
//             $or: [
//               { userId: studentId.toString() },
//               { email: cleanEmail }
//             ]
//           });

//           if (existingUser) {
//             results.duplicates++;
//             console.log(`Duplicate found: ${studentId}`);
//             continue;
//           }

//           // Create user
//           const newUser = {
//             userId: studentId.toString(),
//             name: name.toString().trim(),
//             email: cleanEmail,
//             mobile: finalMobile,
//             role: 'student',
//             department: dept ? dept.toString() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
//             specialization: spec ? spec.toString() : dept ? dept.toString() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
//             session,
//             semester,
//             admissionType: admissionType ? admissionType.toString() : 'JEE',
//             category: category ? category.toString() : 'General',
//             password: 'student123',
//             isActive: true
//           };

//           console.log('✅ Creating user:', newUser.userId, newUser.name);

//           await User.create(newUser);
//           results.success++;

//         } catch (error) {
//           console.error(`❌ Error in row ${i + 1}:`, error);
//           results.errors.push(`Row ${i + 1}: ${error.message}`);
//         }
//       }

//       console.log('📊 Final Results:', results);
//       return results;

//     } catch (error) {
//       console.error('❌ Excel processing error:', error);
//       return {
//         success: 0,
//         errors: [`Excel processing failed: ${error.message}`],
//         duplicates: 0
//       };
//     }
//   }

//   static async processFacultyExcel(fileBuffer, session, semester) {
//     // Similar implementation for faculty
//     try {
//       const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
      
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
//         header: 1,
//         defval: '',
//         raw: false 
//       });

//       const results = {
//         success: 0,
//         errors: [],
//         duplicates: 0
//       };

//       if (!jsonData || jsonData.length < 2) {
//         results.errors.push('Excel file is empty');
//         return results;
//       }

//       // Find header row for faculty
//       let dataStartIndex = -1;
//       let headers = [];

//       for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
//         const row = jsonData[i];
//         if (row && Array.isArray(row)) {
//           const headerIndex = row.findIndex(cell => 
//             cell && typeof cell === 'string' && 
//             (cell.includes('Staff ID') || cell.includes('Employee ID'))
//           );
          
//           if (headerIndex !== -1) {
//             dataStartIndex = i;
//             headers = row;
//             break;
//           }
//         }
//       }

//       if (dataStartIndex === -1) {
//         results.errors.push('Could not find faculty header row');
//         return results;
//       }

//       // Process faculty data similarly...
//       return results;

//     } catch (error) {
//       return {
//         success: 0,
//         errors: [`Faculty Excel processing failed: ${error.message}`],
//         duplicates: 0
//       };
//     }
//   }
// }
import XLSX from 'xlsx';
import User from '../models/User.js';

export class ExcelService {
  static async processStudentExcel(fileBuffer, session, semester) {
    try {
      console.log('📊 Starting Excel processing...');
      
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with proper options
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        raw: false 
      });

      const results = {
        success: 0,
        errors: [],
        duplicates: 0
      };

      if (!jsonData || jsonData.length < 2) {
        results.errors.push('Excel file is empty or has insufficient data');
        return results;
      }

      // Find header row
      let dataStartIndex = -1;
      let headers = [];

      for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
        const row = jsonData[i];
        if (row && Array.isArray(row)) {
          const headerIndex = row.findIndex(cell => 
            cell && typeof cell === 'string' && 
            (cell.includes('SL NO') || cell.includes('Student ID'))
          );
          
          if (headerIndex !== -1) {
            dataStartIndex = i;
            headers = row;
            break;
          }
        }
      }

      if (dataStartIndex === -1) {
        results.errors.push('Could not find header row with column names');
        return results;
      }

      console.log('📋 Headers found at row', dataStartIndex + 1);

      // Find column indices
      const slNoIndex = headers.findIndex(h => h && h.toString().includes('SL NO'));
      const studentIdIndex = headers.findIndex(h => h && h.toString().includes('Student ID'));
      const nameIndex = headers.findIndex(h => h && h.toString().includes('Name'));
      const emailIndex = headers.findIndex(h => h && (h.toString().includes('Email') || h.toString().includes('E-mail')));
      const mobileIndex = headers.findIndex(h => h && h.toString().includes('Mobile'));
      const specIndex = headers.findIndex(h => h && h.toString().includes('Spec'));
      const admissionTypeIndex = headers.findIndex(h => h && h.toString().includes('Admission Type'));
      const categoryIndex = headers.findIndex(h => h && h.toString().includes('Category'));
      const deptIndex = headers.findIndex(h => h && h.toString().includes('Dept'));

      // Collect all valid student data first
      const studentsToCreate = [];
      const existingEmails = new Set();
      const existingUserIds = new Set();

      console.log('📊 Preparing student data...');

      // Get existing users in bulk
      const existingUsers = await User.find({}, { userId: 1, email: 1 });
      existingUsers.forEach(user => {
        if (user.userId) existingUserIds.add(user.userId);
        if (user.email) existingEmails.add(user.email.toLowerCase());
      });

      // Process rows and collect data
      for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row || !Array.isArray(row) || row.length === 0) continue;

        try {
          const slNo = row[slNoIndex];
          const studentId = row[studentIdIndex];
          const name = row[nameIndex];
          let email = row[emailIndex];
          const mobile = row[mobileIndex];
          const spec = row[specIndex];
          const admissionType = row[admissionTypeIndex];
          const category = row[categoryIndex];
          const dept = row[deptIndex];

          // Skip if essential data missing
          if (!slNo || !studentId || !name || slNo === 'SL NO') {
            continue;
          }

          // Generate email if missing
          if (!email || email === '' || email.toString().trim() === '') {
            const cleanStudentId = studentId.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
            email = `${cleanStudentId}@nsut.ac.in`;
          }

          const cleanEmail = email.toString().toLowerCase().trim();
          const cleanMobile = mobile ? mobile.toString().replace(/[^\d]/g, '') : '9999999999';
          const finalMobile = cleanMobile.length >= 10 ? cleanMobile.substring(0, 10) : '9999999999';

          // Check for duplicates
          if (existingUserIds.has(studentId.toString()) || existingEmails.has(cleanEmail)) {
            results.duplicates++;
            continue;
          }

          // Add to creation list
          studentsToCreate.push({
            userId: studentId.toString(),
            name: name.toString().trim(),
            email: cleanEmail,
            mobile: finalMobile,
            role: 'student',
            department: dept ? dept.toString() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
            specialization: spec ? spec.toString() : dept ? dept.toString() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
            session,
            semester,
            admissionType: admissionType ? admissionType.toString() : 'JEE',
            category: category ? category.toString() : 'General',
            password: 'student123',
            isActive: true
          });

          // Avoid duplicates within the same upload
          existingUserIds.add(studentId.toString());
          existingEmails.add(cleanEmail);

        } catch (error) {
          results.errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      console.log(`📊 Prepared ${studentsToCreate.length} students for creation`);

      // Batch create users (in chunks of 50)
      const batchSize = 50;
      for (let i = 0; i < studentsToCreate.length; i += batchSize) {
        const batch = studentsToCreate.slice(i, i + batchSize);
        
        try {
          await User.insertMany(batch, { ordered: false });
          results.success += batch.length;
          console.log(`✅ Created batch ${Math.floor(i/batchSize) + 1}: ${batch.length} students`);
        } catch (error) {
          // Handle individual errors in batch
          for (const student of batch) {
            try {
              await User.create(student);
              results.success++;
            } catch (individualError) {
              results.errors.push(`${student.name}: ${individualError.message}`);
            }
          }
        }
      }

      console.log('📊 Final Results:', results);
      return results;

    } catch (error) {
      console.error('❌ Excel processing error:', error);
      return {
        success: 0,
        errors: [`Excel processing failed: ${error.message}`],
        duplicates: 0
      };
    }
  }

  static async processFacultyExcel(fileBuffer, session, semester) {
    try {
      console.log('📊 Starting Faculty Excel processing...');
      
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with proper options
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        raw: false 
      });

      const results = {
        success: 0,
        errors: [],
        duplicates: 0
      };

      if (!jsonData || jsonData.length < 2) {
        results.errors.push('Faculty Excel file is empty or has insufficient data');
        return results;
      }

      // Find header row
      let dataStartIndex = -1;
      let headers = [];

      for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
        const row = jsonData[i];
        if (row && Array.isArray(row)) {
          const headerIndex = row.findIndex(cell => 
            cell && typeof cell === 'string' && 
            (cell.includes('SL NO') || cell.includes('Staff ID') || cell.includes('Employee ID') || 
             cell.includes('Name') || cell.includes('Faculty') || cell.includes('Professor'))
          );
          
          if (headerIndex !== -1) {
            dataStartIndex = i;
            headers = row;
            break;
          }
        }
      }

      if (dataStartIndex === -1) {
        results.errors.push('Could not find header row with faculty column names');
        return results;
      }

      console.log('📋 Faculty Headers found at row', dataStartIndex + 1, ':', headers);

      // Find column indices for faculty data
      const slNoIndex = headers.findIndex(h => h && h.toString().includes('SL NO'));
      const staffIdIndex = headers.findIndex(h => h && (h.toString().includes('Staff ID') || h.toString().includes('Employee ID') || h.toString().includes('Faculty ID')));
      const nameIndex = headers.findIndex(h => h && h.toString().includes('Name'));
      const emailIndex = headers.findIndex(h => h && (h.toString().includes('Email') || h.toString().includes('E-mail')));
      const mobileIndex = headers.findIndex(h => h && h.toString().includes('Mobile'));
      const deptIndex = headers.findIndex(h => h && (h.toString().includes('Dept') || h.toString().includes('Department')));
      const designationIndex = headers.findIndex(h => h && (h.toString().includes('Designation') || h.toString().includes('Position')));

      // Collect all valid faculty data first
      const facultyToCreate = [];
      const existingEmails = new Set();
      const existingStaffIds = new Set();

      console.log('📊 Preparing faculty data...');

      // Get existing users in bulk
      const existingUsers = await User.find({}, { staffId: 1, email: 1 });
      existingUsers.forEach(user => {
        if (user.staffId) existingStaffIds.add(user.staffId);
        if (user.email) existingEmails.add(user.email.toLowerCase());
      });

      // Process rows and collect data
      for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row || !Array.isArray(row) || row.length === 0) continue;

        try {
          // Extract data using column indices
          const slNo = row[slNoIndex];
          const staffId = row[staffIdIndex] || row[slNoIndex]; // Use SL NO as fallback for Staff ID
          const name = row[nameIndex];
          let email = row[emailIndex];
          const mobile = row[mobileIndex];
          const dept = row[deptIndex];
          const designation = row[designationIndex];

          // Skip if essential data missing
          if (!staffId || !name || staffId === 'SL NO' || staffId === 'Staff ID') {
            console.log(`Skipping faculty row ${i + 1}: Missing essential data`);
            continue;
          }

          // Generate email if missing
          if (!email || email === '' || email.toString().trim() === '') {
            const cleanStaffId = staffId.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanName = name.toString().toLowerCase().replace(/[^a-z]/g, '').substring(0, 5);
            email = `${cleanName}${cleanStaffId}@nsut.ac.in`;
            console.log(`Generated email for ${name}: ${email}`);
          }

          // Clean data
          const cleanEmail = email.toString().toLowerCase().trim();
          const cleanMobile = mobile ? mobile.toString().replace(/[^\d]/g, '') : '9999999999';
          const finalMobile = cleanMobile.length >= 10 ? cleanMobile.substring(0, 10) : '9999999999';

          // Check for duplicates
          if (existingStaffIds.has(staffId.toString()) || existingEmails.has(cleanEmail)) {
            results.duplicates++;
            console.log(`Duplicate faculty found: ${staffId}`);
            continue;
          }

          // Create faculty user object
          const facultyUser = {
            userId: staffId.toString(),
            staffId: staffId.toString(),
            name: name.toString().trim(),
            email: cleanEmail,
            mobile: finalMobile,
            role: 'professor',
            department: dept ? dept.toString().trim() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
            designation: designation ? designation.toString().trim() : 'Professor',
            session,
            semester,
            password: 'prof123',
            isActive: true
          };

          facultyToCreate.push(facultyUser);

          // Avoid duplicates within the same upload
          existingStaffIds.add(staffId.toString());
          existingEmails.add(cleanEmail);

        } catch (error) {
          console.error(`❌ Error in faculty row ${i + 1}:`, error);
          results.errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      console.log(`📊 Prepared ${facultyToCreate.length} faculty for creation`);

      // Batch create faculty (in chunks of 20)
      const batchSize = 20;
      for (let i = 0; i < facultyToCreate.length; i += batchSize) {
        const batch = facultyToCreate.slice(i, i + batchSize);
        
        try {
          await User.insertMany(batch, { ordered: false });
          results.success += batch.length;
          console.log(`✅ Created faculty batch ${Math.floor(i/batchSize) + 1}: ${batch.length} professors`);
        } catch (error) {
          // Handle individual errors in batch
          for (const faculty of batch) {
            try {
              await User.create(faculty);
              results.success++;
            } catch (individualError) {
              results.errors.push(`${faculty.name}: ${individualError.message}`);
            }
          }
        }
      }

      console.log('📊 Faculty Final Results:', results);
      return results;

    } catch (error) {
      console.error('❌ Faculty Excel processing error:', error);
      return {
        success: 0,
        errors: [`Faculty Excel processing failed: ${error.message}`],
        duplicates: 0
      };
    }
  }
} // <-- CLOSING BRACKET ADDED