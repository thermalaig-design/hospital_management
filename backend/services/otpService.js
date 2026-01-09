import { supabase } from '../config/supabase.js';

/**
 * Merge member data from Members Table and elected_members table
 */
const mergeMemberWithElected = async (memberId, memberData) => {
  try {
    console.log(`🔗 Checking if member ID ${memberId} exists in elected_members...`);

    const { data: electedData, error: electedError } = await supabase
      .from('elected_members')
      .select('*')
      .eq('member_id', memberId)
      .limit(1);

    if (electedError) {
      console.error('❌ Error fetching elected member:', electedError);
      return memberData;
    }

    if (electedData && electedData.length > 0) {
      const elected = electedData[0];
      console.log('✅ Member found in elected_members - MERGING DATA');

      return {
        ...memberData,
        // Elected member fields
        'elected_member_id': elected.id,
        'member_id': elected.member_id,
        'position': elected.position,
        'location': elected.location,
        'phone1': elected.phone1,
        'phone2': elected.phone2,
        'is_elected': true,
        'elected_data': elected
      };
    }

    console.log('ℹ️ Member not found in elected_members - returning base data');
    return memberData;

  } catch (error) {
    console.error('❌ Error merging member data:', error);
    return memberData;
  }
};

/**
 * Check if phone number exists in any table
 */
export const checkPhoneExists = async (phoneNumber) => {
  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    console.log(`🔍 Checking if phone ${cleanPhone} exists in database...`);

    // Create search patterns for different phone number formats
    const searchPatterns = [];

    // Add the clean phone number
    if (cleanPhone.length >= 5) searchPatterns.push(cleanPhone);

    // Add with country code if it's a 10-digit number
    if (cleanPhone.length === 10) {
      searchPatterns.push(`91${cleanPhone}`);
      searchPatterns.push(`+91${cleanPhone}`);
    }

    // Add without country code if it's a 12-digit number with 91 prefix
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      searchPatterns.push(cleanPhone.substring(2));
    }

    // Add without country code if it's a 13-digit number with +91 prefix
    if (cleanPhone.length === 13 && cleanPhone.startsWith('+91')) {
      searchPatterns.push(cleanPhone.substring(3));
    }

    // Remove duplicates
    const uniquePatterns = [...new Set(searchPatterns)];

    console.log('📱 Search patterns:', uniquePatterns);

    // Build search conditions for Members Table
    const conditions = [];
    uniquePatterns.forEach(pattern => {
      // Add exact pattern match for the Mobile field
      conditions.push(`Mobile.ilike.%${pattern}%`);

      // Also search for the pattern with common separators
      if (pattern.length === 10) {
        const formattedPatterns = [
          `${pattern.slice(0, 3)}-${pattern.slice(3, 6)}-${pattern.slice(6)}`,
          `${pattern.slice(0, 3)} ${pattern.slice(3, 6)} ${pattern.slice(6)}`,
          `(${pattern.slice(0, 3)}) ${pattern.slice(3, 6)}-${pattern.slice(6)}`,
          `${pattern.slice(0, 5)} ${pattern.slice(5)}`,
          `${pattern.slice(0, 4)} ${pattern.slice(4, 7)} ${pattern.slice(7)}`
        ];

        formattedPatterns.forEach(formatted => {
          conditions.push(`Mobile.ilike.%${formatted}%`);
        });
      }
    });

    const searchCondition = conditions.join(',');

    // Check in Members Table - SELECT ALL FIELDS
    const { data: memberData, error: memberError } = await supabase
      .from('Members Table')
      .select(`
        "S. No.",
        "Membership number",
        "Name",
        "Address Home",
        "Company Name",
        "Address Office",
        "Resident Landline",
        "Office Landline",
        "Mobile",
        "Email",
        type
      `)
      .or(searchCondition)
      .limit(1);

    if (memberError) {
      console.error('❌ Error querying Members Table:', memberError);
    }

    if (memberData && memberData.length > 0) {
      console.log('✅ Phone found in Members Table');
      console.log('📋 Full member data:', JSON.stringify(memberData[0], null, 2));

      const baseMemberUser = {
        // Keep exact field names as they are in database
        'S. No.': memberData[0]['S. No.'],
        'Membership number': memberData[0]['Membership number'],
        'Name': memberData[0]['Name'],
        'Address Home': memberData[0]['Address Home'],
        'Company Name': memberData[0]['Company Name'],
        'Address Office': memberData[0]['Address Office'],
        'Resident Landline': memberData[0]['Resident Landline'],
        'Office Landline': memberData[0]['Office Landline'],
        'Mobile': memberData[0]['Mobile'],
        'Email': memberData[0]['Email'],
        'type': memberData[0].type,

        // Also add normalized fields for easy access
        id: memberData[0]['S. No.'],
        name: memberData[0]['Name'],
        mobile: memberData[0]['Mobile'],
        membership_number: memberData[0]['Membership number']
      };

      // Check if this member is also an elected member
      const mergedUser = await mergeMemberWithElected(memberData[0]['S. No.'], baseMemberUser);

      return {
        exists: true,
        table: 'Members Table',
        user: mergedUser
      };
    }

    // Check in elected_members (if needed)
    const electedConditions = [];
    uniquePatterns.forEach(pattern => {
      electedConditions.push(
        `phone1.ilike.%${pattern}%`,
        `phone2.ilike.%${pattern}%`
      );
    });

    const electedSearchCondition = electedConditions.join(',');

    const { data: electedData, error: _electedError } = await supabase
      .from('elected_members')
      .select('id, phone1, phone2, name, position, member_id')
      .or(electedSearchCondition)
      .limit(1);

    if (electedData && electedData.length > 0) {
      console.log('✅ Phone found in elected_members');
      return {
        exists: true,
        table: 'elected_members',
        user: {
          id: electedData[0].id,
          name: electedData[0].name,
          mobile: electedData[0].phone1 || electedData[0].phone2,
          type: 'Elected Member',
          position: electedData[0].position,
          member_id: electedData[0].member_id,
          is_elected: true
        }
      };
    }

    // Check in opd_schedule
    const opdConditions = [];
    uniquePatterns.forEach(pattern => {
      opdConditions.push(`mobile.ilike.%${pattern}%`);
    });

    const opdSearchCondition = opdConditions.join(',');

    const { data: opdData, error: _opdError } = await supabase
      .from('opd_schedule')
      .select('id, mobile, consultant_name, department, designation')
      .or(opdSearchCondition)
      .eq('is_active', true)
      .limit(1);

    if (opdData && opdData.length > 0) {
      console.log('✅ Phone found in opd_schedule');
      return {
        exists: true,
        table: 'opd_schedule',
        user: {
          id: opdData[0].id,
          name: opdData[0].consultant_name,
          mobile: opdData[0].mobile,
          type: 'Doctor',
          department: opdData[0].department,
          designation: opdData[0].designation
        }
      };
    }

    // Check in hospitals
    const hospitalConditions = [];
    uniquePatterns.forEach(pattern => {
      hospitalConditions.push(`contact_phone.ilike.%${pattern}%`);
    });

    const hospitalSearchCondition = hospitalConditions.join(',');

    const { data: hospitalData, error: _hospitalError } = await supabase
      .from('hospitals')
      .select('id, hospital_name, contact_phone, trust_name')
      .or(hospitalSearchCondition)
      .limit(1);

    if (hospitalData && hospitalData.length > 0) {
      console.log('✅ Phone found in hospitals');
      return {
        exists: true,
        table: 'hospitals',
        user: {
          id: hospitalData[0].id,
          name: hospitalData[0].hospital_name,
          mobile: hospitalData[0].contact_phone,
          type: 'Hospital',
          trust_name: hospitalData[0].trust_name
        }
      };
    }

    console.log('❌ Phone not found in any table');
    return {
      exists: false,
      table: null,
      user: null
    };

  } catch (error) {
    console.error('❌ Error checking phone existence:', error);
    throw error;
  }
};

/**
 * Validate phone number format
 */
const validatePhoneNumber = (phoneNumber) => {
  // Remove all non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits)
  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  }
  
  // Check if it already has country code
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    return `+${cleanPhone}`;
  }
  
  // Check if it already has + and country code
  if (phoneNumber.startsWith('+91') && cleanPhone.length === 12) {
    return phoneNumber;
  }
  
  throw new Error('Invalid phone number format. Must be 10 digits.');
};

/**
 * Initialize phone auth (check if phone exists in system)
 */
export const initializePhoneAuth = async (phoneNumber) => {
  try {
    // Check if phone exists in database
    const phoneCheck = await checkPhoneExists(phoneNumber);
    
    if (!phoneCheck.exists) {
      return {
        success: false,
        message: 'Phone number not registered in the system'
      };
    }
    
    // Validate and format phone number
    const formattedPhone = validatePhoneNumber(phoneNumber);
    
    console.log(`📱 Phone number verified in database: ${formattedPhone}`);
    
    return {
      success: true,
      message: 'Phone number verified in database',
      data: {
        phoneNumber: formattedPhone,
        user: phoneCheck.user
      }
    };
    
  } catch (error) {
    console.error('❌ Error checking phone number:', error);
    throw error;
  }
};