package com.ead2.library_api.service;

import com.ead2.library_api.model.Member;
import com.ead2.library_api.repository.MemberRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
    }

    public Member createMember(Member member) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member updatedMember) {
        Member existing = getMemberById(id);
        existing.setName(updatedMember.getName());
        existing.setEmail(updatedMember.getEmail());
        existing.setPhone(updatedMember.getPhone());
        existing.setActive(updatedMember.isActive());
        return memberRepository.save(existing);
    }

    public void deleteMember(Long id) {
        getMemberById(id);
        memberRepository.deleteById(id);
    }
}