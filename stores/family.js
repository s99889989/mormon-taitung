// stores/family.js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { apiFetch } from '~/utils/api'
import { getAge } from '~/utils/date'

const emptyMember = () => ({
  id: '', name: '', english_name: '', gender: '', birthday: '-',
  spouse: '', priesthood: '', calling: '', stake: '', ward: '',
  person_type: '', organizations: '', positive: '', area: '',
  registration_number: '', address: '', father: '', mother: '', child: [],
})

export const useFamilyStore = defineStore('useFamilyStore', () => {

  const data = reactive({
    search_member_name: '',
    search_member_stake: '花蓮',
    search_member_ward: '台東一',
    search_member_organizations: '所有',
    search_member_person_type: '成員',
    search_member_calling: '所有',
    search_member_positive: '所有',
    search_member_age: 100,
    member_map: new Map(),
    member_list: [],
    editData: {
      id: '', name: '', english_name: '', gender: '男', spouse: '',
      birthday: '', priesthood: '無聖職職位', calling: '',
      stake: '花蓮支聯會', ward: '台東一支會', person_type: '',
      organizations: '慕道友', positive: '', area: '',
      registration_number: '', address: '', father: '', mother: '', child: [],
    },
  })

  const familyList = computed(() => {
    let displayMembers = data.member_list.slice().filter(member =>
      member.stake === '花蓮'
      && member.ward === '台東一'
      && member.organizations !== '非成員'
      && member.organizations !== '傳教士'
      && member.person_type === '成員'
      && member.positive === '積極'
      && member.name !== '蔡維'
    )

    const member_list = []
    displayMembers.forEach(member => {
      let fMember = null
      if (member.father.length > 0) {
        fMember = getMember(member.father)
      }
      while (fMember != null && fMember.father.length > 0) {
        fMember = getMember(fMember.father)
      }
      if (fMember != null && !member_list.includes(fMember)) {
        member_list.push(fMember)
      }
    })

    return member_list
  })

  const getMember = (uuid) => {
    const index = data.member_map.get(uuid)
    return data.member_list[index]
  }

  const getMemberNotNull = (uuid) => {
    const index = data.member_map.get(uuid)
    if (data.member_list[index] != null) {
      return data.member_list[index]
    }
    return emptyMember()
  }

  const refreshMemberMap = () => {
    data.member_list.forEach((member, key) => {
      data.member_map.set(member.id, key)
    })
  }

  const refreshMember = async () => {
    try {
      const response = await apiFetch('mormon/member/get')
      data.member_list = await response.json()
    } catch (error) {
      data.member_list = []
    } finally {
      refreshMemberMap()
    }
  }

  const fixMember = () => {
    data.member_list.forEach(member => {
      const fMember = member.father.length > 0 ? getMember(member.father) : null
      const mMember = member.mother.length > 0 ? getMember(member.mother) : null

      if (fMember && mMember) {
        if (!fMember.spouse) fMember.spouse = mMember.id
        if (!mMember.spouse) mMember.spouse = fMember.id
      }
      if (fMember) {
        if (!fMember.child.includes(member.id)) fMember.child.push(member.id)
        editMember(fMember)
      }
      if (mMember) {
        if (!mMember.child.includes(member.id)) mMember.child.push(member.id)
        editMember(mMember)
      }
      member.child.forEach(uuid => {
        const cMember = getMember(uuid)
        if (cMember) {
          if (member.gender === '男' && !cMember.father) cMember.father = member.id
          if (member.gender === '女' && !cMember.mother) cMember.mother = member.id
          editMember(cMember)
        }
      })
    })
  }

  const editMember = (member) => {
    apiFetch('mormon/member/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    })
  }

  return { data, refreshMember, familyList, fixMember, getMember, getMemberNotNull }
})
