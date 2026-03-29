// stores/members.js
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { apiFetch } from '~/utils/api'
import { getAge } from '~/utils/date'

export const useMembersStore = defineStore('members', () => {

  const data = reactive({
    search_member_name: '',
    search_member_stake: '花蓮',
    search_member_ward: '台東一',
    search_member_organizations: '所有',
    search_member_person_type: '成員',
    search_member_calling: '所有',
    search_member_positive: '積極',
    search_member_age: 100,
    member_map: new Map(),
    member_list: [],
    editData: {
      id: '',
      name: '',
      english_name: '',
      gender: '男',
      spouse: '',
      birthday: '',
      priesthood: '無聖職職位',
      calling: '',
      stake: '花蓮',
      ward: '台東一',
      person_type: '',
      organizations: '非成員',
      positive: '',
      area: '',
      registration_number: '',
      address: '',
      cell_phone: '',
      home_phone: '',
      e_mail: '',
      father: '',
      mother: '',
      death: '在世',
      child: [],
    },
  })

  const memberList = computed(() => {
    let displayMembers = data.member_list.slice()

    if (data.search_member_name.length > 0) {
      displayMembers = displayMembers.filter(e => e.name.includes(data.search_member_name))
    }
    if (data.search_member_stake !== '所有') {
      displayMembers = displayMembers.filter(e => e.stake === data.search_member_stake)
    }
    if (data.search_member_ward !== '所有') {
      displayMembers = displayMembers.filter(e => e.ward === data.search_member_ward)
    }
    if (data.search_member_organizations !== '所有') {
      displayMembers = displayMembers.filter(e => e.organizations === data.search_member_organizations)
    }
    if (data.search_member_calling !== '所有') {
      if (data.search_member_calling === '沒有') {
        displayMembers = displayMembers.filter(e => e.calling.length <= 0)
      } else {
        displayMembers = displayMembers.filter(e => e.calling.includes(data.search_member_calling))
      }
    }
    if (data.search_member_person_type !== '所有') {
      displayMembers = displayMembers.filter(e => e.person_type === data.search_member_person_type)
    }
    if (data.search_member_positive !== '所有') {
      displayMembers = displayMembers.filter(e => e.positive === data.search_member_positive)
    }
    if (data.search_member_age > 0) {
      displayMembers = displayMembers.filter(e => getAge(e.birthday) < data.search_member_age)
    }
    return displayMembers
  })

  const add = async () => {
    await apiFetch('mormon/member/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.editData)
    })
      .then(res => res.text())
      .then(uuidString => {
        data.editData.id = uuidString
        data.member_list.unshift(data.editData)
        refreshMemberMap()
      })
  }

  const edit = () => {
    apiFetch('mormon/member/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.editData)
    }).then(() => {
      const index = data.member_map.get(data.editData.id)
      data.member_list[index] = data.editData
    })
  }

  const edit2 = (member) => {
    apiFetch('mormon/member/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    }).then(() => {
      const index = data.member_map.get(member.id)
      data.member_list[index] = member
    })
  }

  const setEditValue = (id) => {
    const index = data.member_map.get(id)
    data.editData = data.member_list[index]
  }

  const remove = (id) => {
    apiFetch('mormon/member/remove/' + id, { method: 'DELETE' })
    const index = data.member_map.get(id)
    data.member_list.splice(index, 1)
    refreshMemberMap()
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

  return { data, memberList, add, edit, edit2, setEditValue, remove, refreshMember }
})
