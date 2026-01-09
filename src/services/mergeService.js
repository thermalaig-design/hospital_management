const API_BASE_URL = 'https://hospital-management-q8yq.onrender.com/api';

/**
 * Merge member data with elected member data based on member ID
 */
export const getMergedMemberData = async (memberId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/members/${memberId}/elected`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.error('Error fetching elected member data:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error in getMergedMemberData:', error);
    return null;
  }
};

/**
 * Merge member object with elected member data
 */
export const mergeMemberData = async (memberObj) => {
  if (!memberObj || !memberObj['S. No.']) {
    return memberObj;
  }

  const electedData = await getMergedMemberData(memberObj['S. No.']);

  if (electedData) {
    return {
      ...memberObj,
      'elected_member_id': electedData.id,
      'member_id': electedData.member_id,
      'position': electedData.position,
      'location': electedData.location,
      'phone1': electedData.phone1,
      'phone2': electedData.phone2,
      'is_elected': true,
      'elected_data': electedData
    };
  }

  return memberObj;
};

/**
 * Check if a member is also an elected member
 */
export const isElectedMember = (memberObj) => {
  return memberObj && memberObj.is_elected === true;
};

/**
 * Get elected member info from merged member data
 */
export const getElectedMemberInfo = (memberObj) => {
  if (!isElectedMember(memberObj)) {
    return null;
  }

  return {
    position: memberObj.position,
    location: memberObj.location,
    phone1: memberObj.phone1,
    phone2: memberObj.phone2,
    member_id: memberObj.member_id,
    elected_member_id: memberObj.elected_member_id
  };
};

/**
 * Merge multiple members with elected data
 */
export const mergeMultipleMembersData = async (membersArray) => {
  try {
    const mergedMembers = await Promise.all(
      membersArray.map(async (member) => {
        return await mergeMemberData(member);
      })
    );
    return mergedMembers;
  } catch (error) {
    console.error('Error merging multiple members:', error);
    return membersArray;
  }
};
