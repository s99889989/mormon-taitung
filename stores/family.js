import {defineStore} from 'pinia'
import {computed} from "vue";

export const useFamilyStore = defineStore('useFamilyStore', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //http://localhost:9100/
  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_stake: '花蓮',
    search_member_ward: '台東一',
    search_member_organizations: '所有',
    search_member_person_type: '成員',
    search_member_calling: '所有',
    search_member_positive: '所有',
    search_member_age: 100,
    //紀錄UUID和member_list位置
    member_map: new Map(),
    //成員列表
    member_list: [
      {
        id: '',
        name: '',
        english_name: '',
        gender: '',
        birthday: '',
        spouse: '',
        priesthood: '',
        calling: '',
        stake: '',
        ward: '',
        person_type: '',
        organizations: '',
        positive: '',
        area: '',
        registration_number: '',
        address: '',
        father: '',
        mother: '',
        child: [],
      },
    ],
    family_list:[
      {
        father: '',
        mother: '',
        children: [{
          father: '',
          mother: '',
        }],
      }
    ],
    //編輯的成員
    editData: {
      id: '',
      name: '',
      english_name: '',
      gender: '男',
      spouse: '',
      birthday: '',
      priesthood: '無聖職職位',
      calling: '',
      stake: '花蓮支聯會',
      ward: '台東一支會',
      person_type: '',
      organizations: '慕道友',
      positive: '',
      area: '',
      registration_number: '',
      address: '',
      father: '',
      mother: '',
      child: [],
    },
  })
  const familyList = computed(()=>{
    let family_list = [
      {
        father: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
          stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
          father: '', mother: '', child: [],
        },
        mother: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
          stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
          father: '', mother: '', child: [],
        },
        children: [{
          father: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
            stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
            father: '', mother: '', child: [],
          },
          mother: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
            stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
            father: '', mother: '', child: [],
          },
        }],
      }
    ]
    let member_list= [
      {
        id: '',
        name: '',
        english_name: '',
        gender: '',
        birthday: '',
        spouse: '',
        priesthood: '',
        calling: '',
        stake: '',
        ward: '',
        person_type: '',
        organizations: '',
        positive: '',
        area: '',
        registration_number: '',
        address: '',
        father: '',
        mother: '',
        child: [],
      },
    ]

    let displayMembers = data.member_list.slice();
    displayMembers = displayMembers.filter((member) =>
        member.stake === '花蓮'
        && member.ward === '台東一'
        && member.organizations !== '非成員'
        && member.organizations !== '傳教士'
        && member.person_type === '成員'
        && member.positive === '積極'
        && member.name !== '蔡維'
    );
    member_list = [];
    displayMembers.forEach(member=>{
      let fMember = {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
        stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
        father: '', mother: '', child: [],
      };
      fMember = null;
      if(member.father.length > 0){
        fMember = getMember(member.father)
      }

      while (fMember != null && fMember.father.length > 0){
        fMember = getMember(fMember.father)
      }
      if(fMember != null && !member_list.includes(fMember)){

        member_list.push(fMember);
      }

    })

    family_list = [];

    member_list.forEach(menubar=>{

      let family = {
        father: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
          stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
          father: '', mother: '', child: [],
        },
        mother: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
          stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
          father: '', mother: '', child: [],
        },
        children: [{
          father: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
            stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
            father: '', mother: '', child: [],
          },
          mother: {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
            stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
            father: '', mother: '', child: [],
          },
        }],
      }
      family.children = [];
      if(menubar.child.length > 0){
        const child = getMember(menubar.child[0]);
        family.mother = getMember(child.mother);
      }
      family_list.push(family);
    })

    return member_list;
  })
  
  
  // const createFamilyMember = (member, children) => {
  //   return {
  //     id: member.id,
  //     name: member.name,
  //     english_name: member.english_name,
  //     gender: member.gender,
  //     birthday: member.birthday,
  //     spouse: getMemberNotNull(member.spouse),
  //     priesthood: member.priesthood,
  //     calling: member.calling,
  //     stake: member.stake,
  //     ward: member.ward,
  //     person_type: member.person_type,
  //     organizations: member.organizations,
  //     positive: member.positive,
  //     area: member.area,
  //     registration_number: member.registration_number,
  //     address: member.address,
  //     father: getMemberNotNull(member.father),
  //     mother: getMemberNotNull(member.mother),
  //     children: children || [],
  //   };
  // }
  // const generateFamilyTree = (member) => {
  //   if (member === null) {
  //     return null;
  //   }
  //
  //   const father= createFamilyMember(member);
  //
  //
  //
  //   father.children.forEach(uuid=>{
  //     father.children.push(generateFamilyTree(getMember(uuid)))
  //   })
  //
  //
  //
  //
  //   return { father };
  // }
  // const familyTree = () => {
  //
  // }
  //以UUID獲取成員
  const getMember = (uuid) => {
    const index = data.member_map.get(uuid);
    return data.member_list[index];
  }
  const getMemberNotNull = (uuid) => {
    let member = {id: '', name: '', english_name: '', gender: '', birthday: '-', spouse: '', priesthood: '', calling: '',
      stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
      father: '', mother: '', child: [],
    }
    const index = data.member_map.get(uuid);
    if(data.member_list[index] != null){

      member = data.member_list[index];
      console.log(member.name)
    }

    return member;
  }
  //年齡
  const getAge = (birthday) => {
    let age = 0;
    if(birthday.length > 0){
      const birthDate = new Date(birthday);
      const currentDate = new Date();
      age = currentDate.getFullYear() - birthDate.getFullYear();
      if (
          currentDate.getMonth() < birthDate.getMonth() ||
          (currentDate.getMonth() === birthDate.getMonth() &&
              currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    return age;
  }


  //更新人員Map對應列表
  const refreshMemberMap = () => {
    data.member_list.forEach((member, key, index)=>{
      data.member_map.set(member.id, key)
    })
  }

  //刷新人員列表
  const refreshMember = async () => {
    const url = data.main_url+'mormon/member/get';
    try {
      const response = await fetch(url);
      data.member_list = await response.json();
    } catch (error) {
      data.member_list =  [];
    }finally {
      //更新人員Map對應列表
      refreshMemberMap();
    }
  }

  const refreshFamily = () => {

  }
  const fixMember = () => {
    let displayMembers = data.member_list.slice();
    //修正父母
    displayMembers.forEach(member=>{

      let fMember = {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
        stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
        father: '', mother: '', child: [],
      };
      let mMember = {id: '', name: '', english_name: '', gender: '', birthday: '', spouse: '', priesthood: '', calling: '',
        stake: '', ward: '', person_type: '', organizations: '', positive: '', area: '', registration_number: '', address: '',
        father: '', mother: '', child: [],
      };
      fMember = null;
      mMember = null;
      if(member.father.length > 0){
        fMember = getMember(member.father)
      }
      if(member.mother.length > 0){
        mMember = getMember(member.mother)
      }
      if(fMember != null && mMember !=null){

        if(fMember.spouse.length < 1){
          fMember.spouse = mMember.id;
        }
        if(mMember.spouse.length < 1){
          mMember.spouse = fMember.id;
        }

      }
      if(fMember != null){

        if(!fMember.child.includes(member.id)){
          fMember.child.push(member.id)
        }
        edit(fMember);
      }
      if(mMember != null){

        if(!mMember.child.includes(member.id)){
          mMember.child.push(member.id)
        }
        edit(mMember);
      }

      if(member.child.length > 0){
        member.child.forEach(uuid=>{
          const cMember = getMember(uuid);
          if(cMember != null){

            if(member.gender === '男' && cMember.father.length < 1){
              cMember.father = member.id
            }
            if(member.gender === '女' && cMember.mother.length < 1){
              cMember.mother = member.id
            }
            edit(cMember);
          }
        })
      }


    })
    data.member_list = displayMembers;
  }

  //更新
  const edit = (member) => {

    const url = data.main_url+'mormon/member/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member)
    }).then(res => {
      const id = data.editData.id;
      const index = data.member_map.get(id);
      data.member_list[index] =  data.editData;
    })

  }

  return { data, refreshMember, familyList, fixMember, getMember, getMemberNotNull }
})
